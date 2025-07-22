import { useState, useEffect } from 'react'
import { BookOpen, Play, Download, Filter } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { supabase, Course } from '../lib/supabase'

export function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const demoCourses: Course[] = [
    {
      id: 1,
      title: "Natural Skincare Fundamentals",
      description: "Learn the basics of creating your own natural skincare products using organic ingredients. This comprehensive course covers everything from ingredient selection to formulation techniques.",
      price: 49.99,
      image_url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop",
      category: "skincare",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z"
    },
    {
      id: 2,
      title: "Herbal Medicine for Beginners",
      description: "Discover the healing power of herbs and learn how to create natural remedies for common ailments. Includes detailed guides on herb identification and preparation methods.",
      price: 79.99,
      image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop",
      category: "wellness",
      created_at: "2024-01-20T10:00:00Z",
      updated_at: "2024-01-20T10:00:00Z"
    },
    {
      id: 3,
      title: "Organic Nutrition Guide",
      description: "Complete ebook on organic nutrition, meal planning, and understanding the benefits of natural foods. Perfect for anyone looking to improve their health naturally.",
      price: 29.99,
      image_url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop",
      category: "nutrition",
      created_at: "2024-02-01T10:00:00Z",
      updated_at: "2024-02-01T10:00:00Z"
    },
    {
      id: 4,
      title: "Essential Oils Masterclass",
      description: "Master the art of using essential oils for health, wellness, and natural beauty. Learn about different oils, their properties, and safe usage guidelines.",
      price: 89.99,
      image_url: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=300&fit=crop",
      category: "wellness",
      created_at: "2024-02-10T10:00:00Z",
      updated_at: "2024-02-10T10:00:00Z"
    },
    {
      id: 5,
      title: "Natural Home Cleaning Solutions",
      description: "Create effective, non-toxic cleaning products for your home using simple, natural ingredients. Includes recipes and safety guidelines.",
      price: 19.99,
      image_url: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=300&fit=crop",
      category: "lifestyle",
      created_at: "2024-02-15T10:00:00Z",
      updated_at: "2024-02-15T10:00:00Z"
    },
    {
      id: 6,
      title: "Sustainable Living Handbook",
      description: "Comprehensive guide to living sustainably and reducing your environmental impact. Covers everything from zero waste to renewable energy.",
      price: 39.99,
      image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop",
      category: "lifestyle",
      created_at: "2024-02-20T10:00:00Z",
      updated_at: "2024-02-20T10:00:00Z"
    }
  ]

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        setCourses(demoCourses)
      } else {
        setCourses(data || demoCourses)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
      setCourses(demoCourses)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', 'skincare', 'wellness', 'nutrition', 'lifestyle']
  
  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory)

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 animate-pulse text-amber-700 mx-auto mb-4" />
          <p className="text-lg text-stone-600">Loading courses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-stone-900 mb-4">Courses &amp; Ebooks</h1>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto">
              Expand your knowledge with our comprehensive courses and ebooks on natural living
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
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

          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-stone-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-stone-900 mb-2">No courses found</h3>
              <p className="text-stone-500">Check back later for new courses and ebooks!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={course.image_url}
                      alt={course.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl font-bold text-stone-900 line-clamp-2">{course.title}</CardTitle>
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200 capitalize">
                        {course.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-stone-600 line-clamp-3 mb-6">
                      {course.description}
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-stone-900">
                        ${course.price}
                      </span>
                      <div className="flex items-center space-x-2 text-stone-500">
                        <Play className="h-4 w-4" />
                        <span className="text-sm">Digital Access</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button className="w-full py-3 font-semibold rounded-full bg-stone-900 hover:bg-amber-700 text-white transition-all duration-300">
                      <Download className="h-5 w-5 mr-2" />
                      Get Course
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
