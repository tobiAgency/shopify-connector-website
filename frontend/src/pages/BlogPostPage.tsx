import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/button'
import { BlogPost } from '../lib/supabase'

const API_URL = (import.meta as any).env.VITE_API_URL || 'https://app-ajnxmckd.fly.dev'

export function BlogPostPage() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      const response = await fetch(`${API_URL}/api/blogs`)
      
      if (response.ok) {
        const data = await response.json()
        const posts = data.blogs || []
        const foundPost = posts.find((p: BlogPost) => p.id.toString() === id)
        
        if (foundPost) {
          setPost(foundPost)
        } else {
          setError('Blog post not found')
        }
      } else {
        setError('Failed to load blog post')
      }
    } catch (error) {
      console.error('Error fetching blog post:', error)
      setError('Failed to load blog post')
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
          <p className="text-lg text-stone-600">Loading blog post...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-stone-50">
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-stone-900 mb-4">Blog Post Not Found</h1>
              <p className="text-xl text-stone-600 mb-8">
                The blog post you're looking for doesn't exist or has been removed.
              </p>
              <Link to="/blog">
                <Button className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-3 rounded-full font-semibold">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Blog
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link to="/blog">
              <Button variant="outline" className="mb-6 rounded-full border-stone-300 text-stone-700 hover:bg-stone-100">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>

          <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="flex items-center space-x-4 text-sm text-stone-500 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(post.published_at)}
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {post.author}
                </div>
              </div>

              <h1 className="text-4xl font-bold text-stone-900 mb-6 leading-tight">
                {post.title}
              </h1>

              <div className="prose prose-lg prose-stone max-w-none">
                <p className="text-xl text-stone-600 mb-8 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="text-stone-700 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}
