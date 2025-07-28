import { Leaf, Award, Shield } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Link } from 'react-router-dom'

interface Testimonial {
  id: number
  name: string
  quote: string
  image: string
  location?: string
}

export function HomePage() {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      quote: "This program completely transformed my mindset. I went from feeling stuck in my career to launching my own successful business and doubling my income in just 6 months.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Michael Chen",
      quote: "I was struggling with confidence and leadership skills. After applying these strategies, I got promoted to VP and now lead a team of 50+ people with clarity and purpose.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      quote: "My relationships were falling apart and I felt lost. These tools helped me rebuild my marriage, strengthen my family bonds, and create deeper connections than ever before.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "David Thompson",
      quote: "I was 50 pounds overweight and had no energy. The health strategies didn't just transform my body - they gave me the vitality to pursue my dreams with unstoppable energy.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 5,
      name: "Lisa Park",
      quote: "From bankruptcy to building a 7-figure business in 2 years. These wealth-building principles completely changed my financial destiny and my family's future.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 6,
      name: "James Wilson",
      quote: "I was trapped in limiting beliefs and fear. Now I speak on stages worldwide, inspire thousands, and live with unshakeable confidence every single day.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1920&h=1080&fit=crop&crop=center)',
          }}
        >
          <div className="absolute inset-0 bg-blue-900/40"></div>
        </div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Unleash Your Extraordinary Life
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light">
            Transform your potential into power and create the life you deserve
          </p>
          <Link to="/courses">
            <Button 
              size="lg" 
              className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 text-lg font-semibold rounded-full"
            >
              Start Your Transformation
            </Button>
          </Link>
        </div>
      </section>

      {/* Core Pillars Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Core Pillars for Success</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Master these essential areas to create an extraordinary life
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {[
              { name: 'MINDSET', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face' },
              { name: 'WEALTH', image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300&h=300&fit=crop' },
              { name: 'HEALTH', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop' },
              { name: 'RELATIONSHIPS', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=300&fit=crop' },
              { name: 'LEADERSHIP', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=300&fit=crop' }
            ].map((pillar, index) => (
              <div key={index} className="text-center">
                <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-blue-100">
                  <img 
                    src={pillar.image} 
                    alt={pillar.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-bold text-gray-900 text-sm tracking-wider">{pillar.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Real Transformations, Real Results</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover how ordinary people achieved extraordinary breakthroughs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                    {testimonial.location && (
                      <p className="text-gray-600 text-sm">{testimonial.location}</p>
                    )}
                  </div>
                </div>
                <blockquote className="text-gray-700 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Leaf className="h-8 w-8 text-blue-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Proven Strategies</h3>
              <p className="text-gray-600">
                Time-tested methods used by millions worldwide to create lasting transformation and breakthrough results.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-blue-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">World-Class Coaching</h3>
              <p className="text-gray-600">
                Access to elite strategies and insights from top performers, entrepreneurs, and thought leaders.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-blue-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Guaranteed Results</h3>
              <p className="text-gray-600">
                Science-backed methodologies that deliver measurable improvements in every area of your life.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
