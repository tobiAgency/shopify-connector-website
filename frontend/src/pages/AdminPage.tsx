import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Settings, Eye, EyeOff, Loader2, Save, Plus, Edit, Trash2, X, Building } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

interface Config {
  shop_domain: string
  access_token: string
  supabase_url: string
  supabase_anon_key: string
}

export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [config, setConfig] = useState<Config>({
    shop_domain: '',
    access_token: '',
    supabase_url: '',
    supabase_anon_key: ''
  })
  const [showTokens, setShowTokens] = useState({
    access_token: false,
    supabase_anon_key: false
  })
  const [saving, setSaving] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean
    message: string
    shop_name?: string
    error?: string
  } | null>(null)
  const [supabaseConnectionStatus, setSupabaseConnectionStatus] = useState<{
    success: boolean
    message: string
    url?: string
    status_code?: number
    error?: string
  } | null>(null)
  const [testingShopifyConnection, setTestingShopifyConnection] = useState(false)
  const [testingSupabaseConnection, setTestingSupabaseConnection] = useState(false)
  const [courses, setCourses] = useState<any[]>([])
  const [blogPosts, setBlogPosts] = useState<any[]>([])
  const [resources, setResources] = useState<any[]>([])
  const [activeContentTab, setActiveContentTab] = useState<'courses' | 'blogs' | 'resources'>('courses')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [contentLoading, setContentLoading] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const [activeSection, setActiveSection] = useState('shopify')
  const [companies, setCompanies] = useState<any[]>([])
  const [companyLoading, setCompanyLoading] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [editingCompany, setEditingCompany] = useState<any>(null)
  const { toast } = useToast()
  const navigate = useNavigate()

  const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000'

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setIsAuthenticated(true)
        loadConfig()
        loadContentData()
        loadCompanyData()
      }
    }
    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true)
        loadConfig()
        loadContentData()
        loadCompanyData()
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        })
      } else if (data.user) {
        toast({
          title: "Login Successful",
          description: "Welcome to the admin panel!",
        })
        setIsAuthenticated(true)
        loadConfig()
        loadContentData()
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadConfig = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`${API_URL}/api/admin/company-config`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setConfig({
          shop_domain: data.shopify?.shop_url || '',
          access_token: data.shopify?.api_key || '',
          supabase_url: data.supabase?.url || '',
          supabase_anon_key: data.supabase?.annon || ''
        })
      }
    } catch (error) {
      console.error('Failed to load config:', error)
    }
  }

  const handleSaveConfig = async () => {
    setSaving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast({
          title: "Authentication Error",
          description: "Please log in again",
          variant: "destructive",
        })
        return
      }

      const configData = {
        shopify: {
          shop_domain: config.shop_domain || '',
          access_token: config.access_token || ''
        },
        supabase: {
          supabase_url: config.supabase_url || '',
          supabase_anon_key: config.supabase_anon_key || ''
        }
      }

      const response = await fetch(`${API_URL}/api/admin/company-config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(configData)
      })

      if (response.ok) {
        toast({
          title: "Configuration Saved",
          description: "Your settings have been updated successfully.",
        })
        setConnectionStatus(null)
        setSupabaseConnectionStatus(null)
      } else {
        const errorData = await response.json()
        toast({
          title: "Save Failed",
          description: errorData.detail || "Failed to save configuration",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Save Error",
        description: "An unexpected error occurred while saving",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const testShopifyConnection = async () => {
    setTestingShopifyConnection(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`${API_URL}/api/admin/test-shopify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          shop_domain: config.shop_domain,
          access_token: config.access_token
        })
      })
      const result = await response.json()
      setConnectionStatus(result)
    } catch (error) {
      setConnectionStatus({
        success: false,
        message: 'Connection test failed',
        error: 'Network error'
      })
    } finally {
      setTestingShopifyConnection(false)
    }
  }

  const testSupabaseConnection = async () => {
    setTestingSupabaseConnection(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`${API_URL}/api/admin/test-supabase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          supabase_url: config.supabase_url,
          supabase_anon_key: config.supabase_anon_key
        })
      })
      const result = await response.json()
      setSupabaseConnectionStatus(result)
    } catch (error) {
      setSupabaseConnectionStatus({
        success: false,
        message: 'Connection test failed',
        error: 'Network error'
      })
    } finally {
      setTestingSupabaseConnection(false)
    }
  }

  const fetchContent = async (type: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return []

      const response = await fetch(`${API_URL}/api/admin/${type}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        return data.items || []
      }
      return []
    } catch (error) {
      console.error(`Failed to fetch ${type}:`, error)
      return []
    }
  }

  const createContent = async (type: string, data: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return null

      const response = await fetch(`${API_URL}/api/admin/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(data)
      })
      if (response.ok) {
        return await response.json()
      }
      return null
    } catch (error) {
      console.error(`Failed to create ${type}:`, error)
      return null
    }
  }

  const updateContent = async (type: string, id: number, data: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return null

      const response = await fetch(`${API_URL}/api/admin/${type}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(data)
      })
      if (response.ok) {
        return await response.json()
      }
      return null
    } catch (error) {
      console.error(`Failed to update ${type}:`, error)
      return null
    }
  }

  const deleteContent = async (type: string, id: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return false

      const response = await fetch(`${API_URL}/api/admin/${type}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      return response.ok
    } catch (error) {
      console.error(`Failed to delete ${type}:`, error)
      return false
    }
  }

  const loadContentData = async () => {
    setContentLoading(true)
    try {
      const [coursesData, blogsData, resourcesData] = await Promise.all([
        fetchContent('courses'),
        fetchContent('blogs'),
        fetchContent('resources')
      ])
      setCourses(coursesData)
      setBlogPosts(blogsData)
      setResources(resourcesData)
    } catch (error) {
      console.error('Failed to load content data:', error)
    } finally {
      setContentLoading(false)
    }
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await createContent(activeContentTab, formData)
    if (result) {
      toast({
        title: "Created Successfully",
        description: `${activeContentTab.slice(0, -1)} created successfully.`,
      })
      loadContentData()
      cancelForm()
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingItem) {
      const result = await updateContent(activeContentTab, editingItem.id, formData)
      if (result) {
        toast({
          title: "Updated Successfully",
          description: `${activeContentTab.slice(0, -1)} updated successfully.`,
        })
        loadContentData()
        cancelForm()
      }
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const success = await deleteContent(activeContentTab, id)
      if (success) {
        toast({
          title: "Deleted Successfully",
          description: `${activeContentTab.slice(0, -1)} deleted successfully.`,
        })
        loadContentData()
      }
    }
  }

  const startEdit = (item: any) => {
    setEditingItem(item)
    setFormData(item)
    setShowCreateForm(true)
  }

  const startCreate = () => {
    setEditingItem(null)
    setFormData({})
    setShowCreateForm(true)
  }

  const cancelForm = () => {
    setShowCreateForm(false)
    setEditingItem(null)
    setFormData({})
  }

  const loadCompanyData = async () => {
    try {
      setCompanyLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`${API_URL}/api/admin/company`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCompanies(data.companies || [])
        if (data.companies && data.companies.length > 0) {
          setCompanyName(data.companies[0].name || '')
          setEditingCompany(data.companies[0])
        }
      }
    } catch (error) {
      console.error('Failed to load company data:', error)
    } finally {
      setCompanyLoading(false)
    }
  }

  const handleCreateCompany = async () => {
    if (!companyName.trim()) {
      toast({
        title: "Validation Error",
        description: "Company name is required",
        variant: "destructive",
      })
      return
    }

    try {
      setCompanyLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`${API_URL}/api/admin/company`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ name: companyName })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Company created successfully",
        })
        loadCompanyData()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.detail || "Failed to create company",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setCompanyLoading(false)
    }
  }

  const handleUpdateCompany = async () => {
    if (!companyName.trim() || !editingCompany) {
      toast({
        title: "Validation Error",
        description: "Company name is required",
        variant: "destructive",
      })
      return
    }

    try {
      setCompanyLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`${API_URL}/api/admin/company/${editingCompany.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ name: companyName })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Company updated successfully",
        })
        loadCompanyData()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.detail || "Failed to update company",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setCompanyLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const toggleTokenVisibility = (field: keyof typeof showTokens) => {
    setShowTokens(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  const sidebarItems = [
    { id: 'shopify', label: 'Shopify Configuration', icon: Settings },
    { id: 'supabase', label: 'Supabase Configuration', icon: Settings },
    { id: 'company', label: 'Company', icon: Building },
    { id: 'content', label: 'Content Management', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <Settings className="h-8 w-8 text-amber-700" />
            <h1 className="text-xl font-bold text-stone-900">Admin Panel</h1>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors",
                    activeSection === item.id
                      ? "bg-amber-100 text-amber-800 font-medium"
                      : "text-stone-600 hover:bg-stone-100"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="mt-auto p-4">
          <Button onClick={handleLogout} variant="outline" className="w-full">
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <Alert className="mb-6">
          <AlertDescription>
            Configure your API credentials and settings below. Changes will be applied immediately to your application.
          </AlertDescription>
        </Alert>

        {activeSection === 'shopify' && (
          <Card>
            <CardHeader>
              <CardTitle>Shopify API Settings</CardTitle>
              <p className="text-stone-600">Configure your Shopify store connection</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="shop_domain">Shop Domain</Label>
                <Input
                  id="shop_domain"
                  value={config.shop_domain}
                  onChange={(e) => setConfig({...config, shop_domain: e.target.value})}
                  placeholder="your-shop.myshopify.com"
                />
              </div>
              <div>
                <Label htmlFor="access_token">Access Token</Label>
                <div className="relative">
                  <Input
                    id="access_token"
                    type={showTokens.access_token ? "text" : "password"}
                    value={config.access_token}
                    onChange={(e) => setConfig({...config, access_token: e.target.value})}
                    placeholder="shpat_..."
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => toggleTokenVisibility('access_token')}
                  >
                    {showTokens.access_token ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={testShopifyConnection}
                  disabled={testingShopifyConnection}
                  variant="outline"
                >
                  {testingShopifyConnection ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Test Shopify Connection
                </Button>
              </div>
              {connectionStatus && (
                <Alert className={connectionStatus.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  <AlertDescription className={connectionStatus.success ? "text-green-800" : "text-red-800"}>
                    {connectionStatus.message}
                    {connectionStatus.success && connectionStatus.shop_name && (
                      <div className="mt-1 text-sm">
                        Connected to: {connectionStatus.shop_name}
                      </div>
                    )}
                    {!connectionStatus.success && connectionStatus.error && (
                      <div className="mt-1 text-sm">Error: {connectionStatus.error}</div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {activeSection === 'supabase' && (
          <Card>
            <CardHeader>
              <CardTitle>Supabase Configuration</CardTitle>
              <p className="text-stone-600">Configure your Supabase database connection</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="supabase_url">Supabase URL</Label>
                <Input
                  id="supabase_url"
                  value={config.supabase_url}
                  onChange={(e) => setConfig({...config, supabase_url: e.target.value})}
                  placeholder="https://your-project.supabase.co"
                />
              </div>
              <div>
                <Label htmlFor="supabase_anon_key">Supabase Anonymous Key</Label>
                <div className="relative">
                  <Input
                    id="supabase_anon_key"
                    type={showTokens.supabase_anon_key ? "text" : "password"}
                    value={config.supabase_anon_key}
                    onChange={(e) => setConfig({...config, supabase_anon_key: e.target.value})}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => toggleTokenVisibility('supabase_anon_key')}
                  >
                    {showTokens.supabase_anon_key ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={testSupabaseConnection}
                  disabled={testingSupabaseConnection}
                  variant="outline"
                >
                  {testingSupabaseConnection ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Test Supabase Connection
                </Button>
              </div>
              {supabaseConnectionStatus && (
                <Alert className={supabaseConnectionStatus.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  <AlertDescription className={supabaseConnectionStatus.success ? "text-green-800" : "text-red-800"}>
                    {supabaseConnectionStatus.message}
                    {supabaseConnectionStatus.success && supabaseConnectionStatus.url && (
                      <div className="mt-1 text-sm">
                        Connected to: {supabaseConnectionStatus.url} (Status: {supabaseConnectionStatus.status_code})
                      </div>
                    )}
                    {!supabaseConnectionStatus.success && supabaseConnectionStatus.error && (
                      <div className="mt-1 text-sm">Error: {supabaseConnectionStatus.error}</div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {activeSection === 'company' && (
          <Card>
            <CardHeader>
              <CardTitle>Company Management</CardTitle>
              <p className="text-stone-600">Manage your company information</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {companyLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Enter company name"
                    />
                  </div>
                  
                  {companies.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm text-stone-600">
                        Current Company: <strong>{editingCompany?.name}</strong> (ID: {editingCompany?.id})
                      </p>
                      <Button onClick={handleUpdateCompany} disabled={companyLoading}>
                        {companyLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        Update Company
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-stone-600">No company found. Create your first company.</p>
                      <Button onClick={handleCreateCompany} disabled={companyLoading}>
                        {companyLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                        Create Company
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeSection === 'content' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
                <p className="text-stone-600">Manage courses, blog posts, and resources</p>
              </CardHeader>
              <CardContent>
                <Tabs value={activeContentTab} onValueChange={(value) => setActiveContentTab(value as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="courses">Courses</TabsTrigger>
                    <TabsTrigger value="blogs">Blog Posts</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="courses">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Courses & Ebooks</h3>
                        <Button onClick={startCreate}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Course
                        </Button>
                      </div>
                      
                      {(showCreateForm || editingItem) && (
                        <Card>
                          <CardContent className="pt-6">
                            <form onSubmit={editingItem ? handleEditSubmit : handleCreateSubmit} className="space-y-4">
                              <Input 
                                placeholder="Course title" 
                                value={formData.title || ''} 
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                required
                              />
                              <Textarea 
                                placeholder="Course description" 
                                value={formData.description || ''} 
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                required
                              />
                              <Input 
                                type="number" 
                                step="0.01"
                                placeholder="Price" 
                                value={formData.price || ''} 
                                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                                required
                              />
                              <Input 
                                placeholder="Image URL" 
                                value={formData.image_url || ''} 
                                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                                required
                              />
                              <Input 
                                placeholder="Category" 
                                value={formData.category || ''} 
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                required
                              />
                              <div className="flex gap-2">
                                <Button type="submit">
                                  <Save className="h-4 w-4 mr-2" />
                                  {editingItem ? 'Update' : 'Create'} Course
                                </Button>
                                <Button type="button" variant="outline" onClick={cancelForm}>
                                  <X className="h-4 w-4 mr-2" />
                                  Cancel
                                </Button>
                              </div>
                            </form>
                          </CardContent>
                        </Card>
                      )}
                      
                      <div className="space-y-2">
                        {contentLoading ? (
                          <div className="text-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                          </div>
                        ) : courses.length === 0 ? (
                          <div className="text-center py-8 text-stone-500">
                            No courses found. Create your first course!
                          </div>
                        ) : (
                          courses.map((course) => (
                            <Card key={course.id}>
                              <CardContent className="flex justify-between items-center p-4">
                                <div>
                                  <h4 className="font-medium">{course.title}</h4>
                                  <p className="text-sm text-stone-600">${course.price} • {course.category}</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => startEdit(course)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => handleDelete(course.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="blogs">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Blog Posts</h3>
                        <Button onClick={startCreate}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Blog Post
                        </Button>
                      </div>
                      
                      {(showCreateForm || editingItem) && (
                        <Card>
                          <CardContent className="pt-6">
                            <form onSubmit={editingItem ? handleEditSubmit : handleCreateSubmit} className="space-y-4">
                              <Input 
                                placeholder="Blog post title" 
                                value={formData.title || ''} 
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                required
                              />
                              <Textarea 
                                placeholder="Blog post content" 
                                value={formData.content || ''} 
                                onChange={(e) => setFormData({...formData, content: e.target.value})}
                                rows={6}
                                required
                              />
                              <Textarea 
                                placeholder="Excerpt (short description)" 
                                value={formData.excerpt || ''} 
                                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                                required
                              />
                              <Input 
                                placeholder="Author" 
                                value={formData.author || ''} 
                                onChange={(e) => setFormData({...formData, author: e.target.value})}
                                required
                              />
                              <Input 
                                type="datetime-local"
                                placeholder="Published date (optional)" 
                                value={formData.published_at || ''} 
                                onChange={(e) => setFormData({...formData, published_at: e.target.value})}
                              />
                              <div className="flex gap-2">
                                <Button type="submit">
                                  <Save className="h-4 w-4 mr-2" />
                                  {editingItem ? 'Update' : 'Create'} Blog Post
                                </Button>
                                <Button type="button" variant="outline" onClick={cancelForm}>
                                  <X className="h-4 w-4 mr-2" />
                                  Cancel
                                </Button>
                              </div>
                            </form>
                          </CardContent>
                        </Card>
                      )}
                      
                      <div className="space-y-2">
                        {contentLoading ? (
                          <div className="text-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                          </div>
                        ) : blogPosts.length === 0 ? (
                          <div className="text-center py-8 text-stone-500">
                            No blog posts found. Create your first blog post!
                          </div>
                        ) : (
                          blogPosts.map((post) => (
                            <Card key={post.id}>
                              <CardContent className="flex justify-between items-center p-4">
                                <div>
                                  <h4 className="font-medium">{post.title}</h4>
                                  <p className="text-sm text-stone-600">By {post.author}</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => startEdit(post)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => handleDelete(post.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="resources">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Resources</h3>
                        <Button onClick={startCreate}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Resource
                        </Button>
                      </div>
                      
                      {(showCreateForm || editingItem) && (
                        <Card>
                          <CardContent className="pt-6">
                            <form onSubmit={editingItem ? handleEditSubmit : handleCreateSubmit} className="space-y-4">
                              <Input 
                                placeholder="Resource title" 
                                value={formData.title || ''} 
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                required
                              />
                              <Textarea 
                                placeholder="Resource description" 
                                value={formData.description || ''} 
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                required
                              />
                              <Input 
                                placeholder="File URL" 
                                value={formData.file_url || ''} 
                                onChange={(e) => setFormData({...formData, file_url: e.target.value})}
                                required
                              />
                              <Input 
                                placeholder="Category" 
                                value={formData.category || ''} 
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                required
                              />
                              <div className="flex gap-2">
                                <Button type="submit">
                                  <Save className="h-4 w-4 mr-2" />
                                  {editingItem ? 'Update' : 'Create'} Resource
                                </Button>
                                <Button type="button" variant="outline" onClick={cancelForm}>
                                  <X className="h-4 w-4 mr-2" />
                                  Cancel
                                </Button>
                              </div>
                            </form>
                          </CardContent>
                        </Card>
                      )}
                      
                      <div className="space-y-2">
                        {contentLoading ? (
                          <div className="text-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                          </div>
                        ) : resources.length === 0 ? (
                          <div className="text-center py-8 text-stone-500">
                            No resources found. Create your first resource!
                          </div>
                        ) : (
                          resources.map((resource) => (
                            <Card key={resource.id}>
                              <CardContent className="flex justify-between items-center p-4">
                                <div>
                                  <h4 className="font-medium">{resource.title}</h4>
                                  <p className="text-sm text-stone-600">{resource.category}</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => startEdit(resource)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => handleDelete(resource.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <Button 
            onClick={handleSaveConfig}
            disabled={saving}
            className="bg-amber-700 hover:bg-amber-800"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </div>
    </div>
  )
}
