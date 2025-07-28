import { useState, useEffect } from 'react'
import { FileText, Download, Search, Filter, ExternalLink } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Resource } from '../lib/supabase'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')

  const demoResources: Resource[] = [
    {
      id: 1,
      title: "Natural Skincare Recipe Collection",
      description: "A comprehensive collection of DIY natural skincare recipes using simple, organic ingredients. Includes face masks, cleansers, moisturizers, and more.",
      file_url: "https://example.com/skincare-recipes.pdf",
      category: "guides",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z"
    },
    {
      id: 2,
      title: "Herb Identification Chart",
      description: "Visual guide to identifying common medicinal herbs. Perfect for foraging and understanding the herbs used in natural remedies.",
      file_url: "https://example.com/herb-chart.pdf",
      category: "charts",
      created_at: "2024-01-20T10:00:00Z",
      updated_at: "2024-01-20T10:00:00Z"
    },
    {
      id: 3,
      title: "Essential Oil Safety Guidelines",
      description: "Important safety information for using essential oils, including dilution ratios, contraindications, and proper storage methods.",
      file_url: "https://example.com/essential-oil-safety.pdf",
      category: "safety",
      created_at: "2024-02-01T10:00:00Z",
      updated_at: "2024-02-01T10:00:00Z"
    },
    {
      id: 4,
      title: "Seasonal Produce Calendar",
      description: "Know what's in season throughout the year with this comprehensive guide to seasonal fruits and vegetables for optimal nutrition.",
      file_url: "https://example.com/seasonal-produce.pdf",
      category: "nutrition",
      created_at: "2024-02-10T10:00:00Z",
      updated_at: "2024-02-10T10:00:00Z"
    },
    {
      id: 5,
      title: "Natural Cleaning Product Recipes",
      description: "Make your own non-toxic cleaning products with these simple recipes using common household ingredients.",
      file_url: "https://example.com/cleaning-recipes.pdf",
      category: "guides",
      created_at: "2024-02-15T10:00:00Z",
      updated_at: "2024-02-15T10:00:00Z"
    },
    {
      id: 6,
      title: "Meditation and Mindfulness Tracker",
      description: "Printable tracker to help you maintain a consistent meditation and mindfulness practice for better mental health.",
      file_url: "https://example.com/meditation-tracker.pdf",
      category: "wellness",
      created_at: "2024-02-20T10:00:00Z",
      updated_at: "2024-02-20T10:00:00Z"
    }
  ]

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const response = await fetch(`${API_URL}/api/resources`)
      
      if (response.ok) {
        const data = await response.json()
        setResources(data.resources || demoResources)
      } else {
        console.error('API error:', response.status)
        setResources(demoResources)
      }
    } catch (error) {
      console.error('Error fetching resources:', error)
      setResources(demoResources)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', 'guides', 'charts', 'safety', 'nutrition', 'wellness']
  
  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 animate-pulse text-amber-700 mx-auto mb-4" />
          <p className="text-lg text-stone-600">Loading resources...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-stone-900 mb-4">Resources</h1>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto">
              Free downloadable resources to support your natural health and wellness journey
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 mb-12">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`capitalize ${
                    selectedCategory === category 
                      ? 'bg-amber-700 hover:bg-amber-800' 
                      : 'border-stone-300 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-stone-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-stone-900 mb-2">No resources found</h3>
              <p className="text-stone-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl font-bold text-stone-900 line-clamp-2">{resource.title}</CardTitle>
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200 capitalize">
                        {resource.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-stone-600 line-clamp-4 mb-6">
                      {resource.description}
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-stone-500">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">PDF Download</span>
                      </div>
                      <div className="flex items-center space-x-2 text-stone-500">
                        <ExternalLink className="h-4 w-4" />
                        <span className="text-sm">Free</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      className="w-full py-3 font-semibold rounded-full bg-stone-900 hover:bg-amber-700 text-white transition-all duration-300"
                      onClick={() => window.open(resource.file_url, '_blank')}
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download Resource
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
