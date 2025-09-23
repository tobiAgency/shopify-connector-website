import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Label } from '../components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Eye, EyeOff, Save, Lock, Settings, Plus, Edit, Trash2, X, Loader2 } from 'lucide-react'
import { useToast } from '../hooks/use-toast'
import { Course, BlogPost, Resource, supabase } from '../lib/supabase'
import type { Session } from '@supabase/supabase-js'

interface AdminConfig {
  shopify_shop_url: string
  shopify_access_token: string
  shopify_api_version: string
  supabase_url: string
  supabase_anon_key: string
}

export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [session, setSession] = useState<Session | null>(null)
  const [config, setConfig] = useState<AdminConfig>({
    shopify_shop_url: '',
    shopify_access_token: '',
    shopify_api_version: '2023-10',
    supabase_url: '',
    supabase_anon_key: ''
  })
  const [showTokens, setShowTokens] = useState({
    shopify_access_token: false,
    supabase_anon_key: false
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean;
    message: string;
    error?: string;
    shop_name?: string;
    shop_domain?: string;
  } | null>(null)
  const [testingConnection, setTestingConnection] = useState(false)
  const [supabaseConnectionStatus, setSupabaseConnectionStatus] = useState<{
    success: boolean;
    message: string;
    error?: string;
    url?: string;
    status_code?: number;
  } | null>(null)
  const [testingSupabaseConnection, setTestingSupabaseConnection] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [activeContentTab, setActiveContentTab] = useState<'courses' | 'blogs' | 'resources'>('courses')
  const [editingItem, setEditingItem] = useState<any>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [contentLoading, setContentLoading] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const { toast } = useToast()
  const navigate = useNavigate()

  const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000'

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setIsAuthenticated(!!session)
      if (session) {
        loadConfig(session.access_token)
        loadContentData(session.access_token)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setIsAuthenticated(!!session)
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
      } else if (data.session) {
        setSession(data.session)
        setIsAuthenticated(true)
        loadConfig(data.session.access_token)
        loadContentData(data.session.access_token)
        toast({
          title: "Login Successful",
          description: "Welcome to the admin panel.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to Supabase.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setEmail('')
      setPassword('')
    }
  }

  const loadConfig = async (token?: string) => {
    const authToken = token || session?.access_token
    if (!authToken) return
    
    try {
      const response = await fetch(`${API_URL}/api/admin/config`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setConfig(data.config)
      }
    } catch (error) {
      console.error('Failed to load config:', error)
    }
  }

  const handleSaveConfig = async () => {
    setSaving(true)
    
    try {
      let cleanShopUrl = config.shopify_shop_url.trim()
      
      cleanShopUrl = cleanShopUrl.replace(/^https?:\/\//, '')
      
      cleanShopUrl = cleanShopUrl.split('/')[0]
      
      if (cleanShopUrl && !cleanShopUrl.includes('.myshopify.com')) {
        if (!cleanShopUrl.includes('.')) {
          cleanShopUrl = `${cleanShopUrl}.myshopify.com`
        }
      }
      
      const cleanedConfig = {
        ...config,
        shopify_shop_url: cleanShopUrl
      }
      
      const response = await fetch(`${API_URL}/api/admin/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ config: cleanedConfig }),
      })

      if (response.ok) {
        setConfig(cleanedConfig)
        toast({
          title: "Configuration Saved",
          description: "All settings have been updated successfully.",
        })
      } else {
        toast({
          title: "Save Failed",
          description: "Failed to save configuration. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save configuration.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const testShopifyConnection = async () => {
    if (!session?.access_token) return
    
    setTestingConnection(true)
    setConnectionStatus(null)

    try {
      const response = await fetch(`${API_URL}/api/admin/test-shopify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      
      const result = await response.json()
      setConnectionStatus(result)
    } catch (error) {
      setConnectionStatus({
        success: false,
        message: 'Failed to test connection',
        error: 'Network error'
      })
    } finally {
      setTestingConnection(false)
    }
  }

  const testSupabaseConnection = async () => {
    if (!session?.access_token) return
    
    setTestingSupabaseConnection(true)
    setSupabaseConnectionStatus(null)

    try {
      const response = await fetch(`${API_URL}/api/admin/test-supabase`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      
      const result = await response.json()
      setSupabaseConnectionStatus(result)
    } catch (error) {
      setSupabaseConnectionStatus({
        success: false,
        message: 'Failed to test connection',
        error: 'Network error'
      })
    } finally {
      setTestingSupabaseConnection(false)
    }
  }

  const fetchContent = async (type: string, token?: string) => {
    const authToken = token || session?.access_token
    if (!authToken) return []
    try {
      const response = await fetch(`${API_URL}/api/admin/${type}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      })
      const data = await response.json()
      return data[type] || []
    } catch (error) {
      console.error(`Error fetching ${type}:`, error)
      return []
    }
  }

  const createContent = async (type: string, data: any) => {
    if (!session?.access_token) return false
    try {
      const response = await fetch(`${API_URL}/api/admin/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(data)
      })
      return response.ok
    } catch (error) {
      console.error(`Error creating ${type}:`, error)
      return false
    }
  }

  const updateContent = async (type: string, id: number, data: any) => {
    if (!session?.access_token) return false
    try {
      const response = await fetch(`${API_URL}/api/admin/${type}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(data)
      })
      return response.ok
    } catch (error) {
      console.error(`Error updating ${type}:`, error)
      return false
    }
  }

  const deleteContent = async (type: string, id: number) => {
    if (!session?.access_token) return false
    try {
      const response = await fetch(`${API_URL}/api/admin/${type}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      return response.ok
    } catch (error) {
      console.error(`Error deleting ${type}:`, error)
      return false
    }
  }

  const loadContentData = async (token?: string) => {
    setContentLoading(true)
    try {
      const [coursesData, blogsData, resourcesData] = await Promise.all([
        fetchContent('courses', token),
        fetchContent('blogs', token),
        fetchContent('resources', token)
      ])
      setCourses(coursesData)
      setBlogPosts(blogsData)
      setResources(resourcesData)
    } catch (error) {
      console.error('Error loading content data:', error)
    } finally {
      setContentLoading(false)
    }
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await createContent(activeContentTab, formData)
    if (success) {
      toast({
        title: "Success",
        description: `${activeContentTab.slice(0, -1)} created successfully`,
      })
      setShowCreateForm(false)
      setFormData({})
      loadContentData()
    } else {
      toast({
        title: "Error",
        description: `Failed to create ${activeContentTab.slice(0, -1)}`,
        variant: "destructive",
      })
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await updateContent(activeContentTab, editingItem.id, formData)
    if (success) {
      toast({
        title: "Success",
        description: `${activeContentTab.slice(0, -1)} updated successfully`,
      })
      setEditingItem(null)
      setFormData({})
      loadContentData()
    } else {
      toast({
        title: "Error",
        description: `Failed to update ${activeContentTab.slice(0, -1)}`,
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm(`Are you sure you want to delete this ${activeContentTab.slice(0, -1)}?`)) return
    
    const success = await deleteContent(activeContentTab, id)
    if (success) {
      toast({
        title: "Success",
        description: `${activeContentTab.slice(0, -1)} deleted successfully`,
      })
      loadContentData()
    } else {
      toast({
        title: "Error",
        description: `Failed to delete ${activeContentTab.slice(0, -1)}`,
        variant: "destructive",
      })
    }
  }

  const startEdit = (item: any) => {
    setEditingItem(item)
    setFormData(item)
    setShowCreateForm(false)
  }

  const startCreate = () => {
    setShowCreateForm(true)
    setEditingItem(null)
    setFormData({})
  }

  const cancelForm = () => {
    setShowCreateForm(false)
    setEditingItem(null)
    setFormData({})
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setSession(null)
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
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Lock className="h-12 w-12 text-amber-700" />
            </div>
            <CardTitle className="text-2xl font-bold text-stone-900">Admin Access</CardTitle>
            <p className="text-stone-600">Enter your admin credentials to continue</p>
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
                  placeholder="Enter admin email"
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
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-amber-700 hover:bg-amber-800"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Settings className="h-8 w-8 text-amber-700" />
            <h1 className="text-3xl font-bold text-stone-900">Admin Panel</h1>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <Alert className="mb-6">
          <AlertDescription>
            Configure your API credentials and settings below. Changes will be applied immediately to your application.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="shopify" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="shopify">Shopify Configuration</TabsTrigger>
            <TabsTrigger value="supabase">Supabase Configuration</TabsTrigger>
            <TabsTrigger value="content">Content Management</TabsTrigger>
          </TabsList>

          <TabsContent value="shopify">
            <Card>
              <CardHeader>
                <CardTitle>Shopify API Settings</CardTitle>
                <p className="text-stone-600">Configure your Shopify store connection</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="shopify_shop_url">Shop URL</Label>
                  <Input
                    id="shopify_shop_url"
                    value={config.shopify_shop_url}
                    onChange={(e) => setConfig(prev => ({ ...prev, shopify_shop_url: e.target.value }))}
                    placeholder="your-shop-name.myshopify.com"
                  />
                  <p className="text-sm text-stone-600 mt-1">
                    Enter just the shop name (e.g., "my-shop.myshopify.com" or "my-shop")
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="shopify_access_token">Access Token</Label>
                  <div className="relative">
                    <Input
                      id="shopify_access_token"
                      type={showTokens.shopify_access_token ? 'text' : 'password'}
                      value={config.shopify_access_token}
                      onChange={(e) => setConfig(prev => ({ ...prev, shopify_access_token: e.target.value }))}
                      placeholder="Enter your Shopify access token"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => toggleTokenVisibility('shopify_access_token')}
                    >
                      {showTokens.shopify_access_token ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="shopify_api_version">API Version</Label>
                  <Input
                    id="shopify_api_version"
                    value={config.shopify_api_version}
                    onChange={(e) => setConfig(prev => ({ ...prev, shopify_api_version: e.target.value }))}
                    placeholder="2023-10"
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={testShopifyConnection}
                    disabled={testingConnection}
                    variant="outline"
                    className="border-amber-700 text-amber-700 hover:bg-amber-50"
                  >
                    {testingConnection ? 'Testing...' : 'Test Connection'}
                  </Button>
                </div>

                {connectionStatus && (
                  <Alert className={connectionStatus.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                    <AlertDescription className={connectionStatus.success ? "text-green-800" : "text-red-800"}>
                      <div className="font-medium">{connectionStatus.message}</div>
                      {connectionStatus.success && connectionStatus.shop_name && (
                        <div className="mt-1 text-sm">
                          Connected to: {connectionStatus.shop_name} ({connectionStatus.shop_domain})
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
          </TabsContent>

          <TabsContent value="supabase">
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
                    onChange={(e) => setConfig(prev => ({ ...prev, supabase_url: e.target.value }))}
                    placeholder="https://your-project.supabase.co"
                  />
                </div>

                <div>
                  <Label htmlFor="supabase_anon_key">Anonymous Key</Label>
                  <div className="relative">
                    <Input
                      id="supabase_anon_key"
                      type={showTokens.supabase_anon_key ? 'text' : 'password'}
                      value={config.supabase_anon_key}
                      onChange={(e) => setConfig(prev => ({ ...prev, supabase_anon_key: e.target.value }))}
                      placeholder="Enter your Supabase anonymous key"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => toggleTokenVisibility('supabase_anon_key')}
                    >
                      {showTokens.supabase_anon_key ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={testSupabaseConnection}
                    disabled={testingSupabaseConnection}
                    variant="outline"
                    className="border-amber-700 text-amber-700 hover:bg-amber-50"
                  >
                    {testingSupabaseConnection ? 'Testing...' : 'Test Connection'}
                  </Button>
                </div>

                {supabaseConnectionStatus && (
                  <Alert className={supabaseConnectionStatus.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                    <AlertDescription className={supabaseConnectionStatus.success ? "text-green-800" : "text-red-800"}>
                      <div className="font-medium">{supabaseConnectionStatus.message}</div>
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
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>Manage courses, blog posts, and resources</CardDescription>
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
          </TabsContent>
        </Tabs>

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
