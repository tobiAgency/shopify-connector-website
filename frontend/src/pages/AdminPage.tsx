import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Eye, EyeOff, Save, Lock, Settings } from 'lucide-react'
import { useToast } from '../hooks/use-toast'

interface AdminConfig {
  shopify_shop_url: string
  shopify_access_token: string
  shopify_api_version: string
  supabase_url: string
  supabase_anon_key: string
}

export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
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
  const { toast } = useToast()
  const navigate = useNavigate()

  const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000'

  useEffect(() => {
    const adminAuth = localStorage.getItem('admin_authenticated')
    if (adminAuth === 'true') {
      setIsAuthenticated(true)
      loadConfig()
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        setIsAuthenticated(true)
        localStorage.setItem('admin_authenticated', 'true')
        loadConfig()
        toast({
          title: "Login Successful",
          description: "Welcome to the admin panel.",
        })
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid password. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to the server.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setPassword('')
    }
  }

  const loadConfig = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/config`, {
        headers: {
          'Authorization': 'Bearer admin_token'
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
      const response = await fetch(`${API_URL}/api/admin/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin_token'
        },
        body: JSON.stringify({ config }),
      })

      if (response.ok) {
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

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('admin_authenticated')
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
            <p className="text-stone-600">Enter the admin password to continue</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="shopify">Shopify Configuration</TabsTrigger>
            <TabsTrigger value="supabase">Supabase Configuration</TabsTrigger>
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
