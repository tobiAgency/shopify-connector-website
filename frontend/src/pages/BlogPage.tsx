import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, User, Clock, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card'
import { BlogPost } from '../lib/supabase'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  const demoPosts: BlogPost[] = [
    {
      id: 1,
      title: "The Benefits of Natural Skincare: Why Your Skin Will Thank You",
      content: "Natural skincare has gained tremendous popularity in recent years, and for good reason. Unlike conventional products that often contain harsh chemicals, natural skincare products work in harmony with your skin's natural processes...",
      excerpt: "Discover why switching to natural skincare products can transform your skin health and overall well-being.",
      author: "Dr. Sarah Mitchell",
      published_at: "2024-07-15T10:00:00Z",
      created_at: "2024-07-15T10:00:00Z",
      updated_at: "2024-07-15T10:00:00Z"
    },
    {
      id: 2,
      title: "5 Essential Herbs Every Natural Health Enthusiast Should Know",
      content: "Herbal medicine has been used for thousands of years to promote health and healing. Today, we're rediscovering the power of these natural remedies. Here are five essential herbs that should be in every natural health toolkit...",
      excerpt: "Learn about five powerful herbs that can support your natural health journey and how to use them safely.",
      author: "Michael Green",
      published_at: "2024-07-10T10:00:00Z",
      created_at: "2024-07-10T10:00:00Z",
      updated_at: "2024-07-10T10:00:00Z"
    },
    {
      id: 3,
      title: "Creating a Toxin-Free Home: Simple Swaps for Better Health",
      content: "Our homes should be our sanctuaries, but many common household products contain harmful chemicals that can impact our health. The good news is that creating a toxin-free home doesn't have to be overwhelming or expensive...",
      excerpt: "Simple, practical tips for reducing toxins in your home environment and protecting your family's health.",
      author: "Emma Rodriguez",
      published_at: "2024-07-05T10:00:00Z",
      created_at: "2024-07-05T10:00:00Z",
      updated_at: "2024-07-05T10:00:00Z"
    },
    {
      id: 4,
      title: "The Science Behind Essential Oils: More Than Just Pleasant Scents",
      content: "Essential oils have been used for centuries, but modern science is now validating many of their traditional uses. From antimicrobial properties to stress reduction, essential oils offer a range of benefits backed by research...",
      excerpt: "Explore the scientific research behind essential oils and their proven health benefits.",
      author: "Dr. James Wilson",
      published_at: "2024-06-30T10:00:00Z",
      created_at: "2024-06-30T10:00:00Z",
      updated_at: "2024-06-30T10:00:00Z"
    },
    {
      id: 5,
      title: "Seasonal Eating: How to Align Your Diet with Nature's Rhythm",
      content: "Eating seasonally isn't just a trendy concept – it's a practice rooted in wisdom that can improve your health, support local agriculture, and reduce your environmental impact. Here's how to embrace seasonal eating...",
      excerpt: "Learn how eating seasonally can improve your health while supporting sustainable agriculture.",
      author: "Lisa Park",
      published_at: "2024-06-25T10:00:00Z",
      created_at: "2024-06-25T10:00:00Z",
      updated_at: "2024-06-25T10:00:00Z"
    },
    {
      id: 6,
      title: "Natural Stress Management: Ancient Wisdom for Modern Life",
      content: "In our fast-paced world, stress has become a constant companion for many. While we can't eliminate all stress from our lives, we can learn to manage it naturally using time-tested techniques and natural remedies...",
      excerpt: "Discover natural, effective ways to manage stress and improve your mental well-being.",
      author: "David Thompson",
      published_at: "2024-06-20T10:00:00Z",
      created_at: "2024-06-20T10:00:00Z",
      updated_at: "2024-06-20T10:00:00Z"
    }
  ]

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/blogs`)
      
      if (response.ok) {
        const data = await response.json()
        setPosts(data.blogs || demoPosts)
      } else {
        console.error('API error:', response.status)
        setPosts(demoPosts)
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error)
      setPosts(demoPosts)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="h-12 w-12 animate-pulse text-amber-700 mx-auto mb-4" />
          <p className="text-lg text-stone-600">Loading blog posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-stone-900 mb-4">Weekly Newsletter &amp; Blog</h1>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto">
              Stay informed with our latest insights on natural health, wellness, and sustainable living
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 mb-16 shadow-lg">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-stone-900 mb-4">Subscribe to Our Weekly Newsletter</h2>
              <p className="text-stone-600 mb-6">
                Get the latest natural health tips, product updates, and exclusive content delivered to your inbox every week.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 border border-stone-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
                />
                <Button className="px-8 py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-full font-semibold">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-stone-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-stone-900 mb-2">No blog posts found</h3>
              <p className="text-stone-500">Check back later for new articles!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4 text-sm text-stone-500 mb-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(post.published_at)}
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {post.author}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-stone-900 line-clamp-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-stone-600 line-clamp-3 mb-6">
                      {post.excerpt}
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-stone-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">5 min read</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Link to={`/blog/${post.id}`} className="w-full">
                      <Button variant="outline" className="w-full py-3 font-semibold rounded-full border-stone-300 text-stone-700 hover:bg-stone-100 transition-all duration-300">
                        <ArrowRight className="h-5 w-5 mr-2" />
                        Read More
                      </Button>
                    </Link>
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
