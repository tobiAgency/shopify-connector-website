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
      quote: "This product made my skin feel so fresh and relaxed. While giving it a natural glow although I have an oily skin type, this product does not make my skin feel greasy.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Michael Chen",
      quote: "I like this product very much. It's very creamy and feels good on the skin. This product is also affordable for me and my skin type, this product is perfect.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      quote: "I love the tallow I received! The scent is nice and subtle. The texture is smooth and easy to apply. The consistency is not too thick or too thin.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "David Thompson",
      quote: "It's cool, it feels good on the skin. I feel like it's working and my skin looks healthier. Natural ingredients make all the difference.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 5,
      name: "Lisa Park",
      quote: "Amazing quality! The natural ingredients really show in the results. My skin has never felt better since switching to these organic products.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 6,
      name: "James Wilson",
      quote: "Excellent product that delivers on its promises. The organic formula is gentle yet effective. Highly recommend for anyone looking for natural skincare.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    }
  ]

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=1080&fit=crop&crop=center)',
          }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Natural Products
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light">
            Quality that works with nature
          </p>
          <Link to="/products">
            <Button 
              size="lg" 
              className="bg-white text-stone-900 hover:bg-stone-100 px-8 py-4 text-lg font-semibold rounded-full"
            >
              Shop Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Real Ingredients Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-900 mb-4">Real Ingredients</h2>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto">
              Effective solutions for your everyday needs.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {[
              { name: 'NATURAL', image: 'https://images.unsplash.com/photo-1574263867128-a3d5c1b1deac?w=300&h=300&fit=crop' },
              { name: 'ORGANIC', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop' },
              { name: 'PURE', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop' },
              { name: 'FRESH', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop' },
              { name: 'QUALITY', image: 'https://images.unsplash.com/photo-1574263867128-a3d5c1b1deac?w=300&h=300&fit=crop' }
            ].map((ingredient, index) => (
              <div key={index} className="text-center">
                <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-amber-100">
                  <img 
                    src={ingredient.image} 
                    alt={ingredient.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-bold text-stone-900 text-sm tracking-wider">{ingredient.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto">
              Real experiences from people who love our natural products
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
                    <h4 className="font-bold text-stone-900 text-lg">{testimonial.name}</h4>
                    {testimonial.location && (
                      <p className="text-stone-600 text-sm">{testimonial.location}</p>
                    )}
                  </div>
                </div>
                <blockquote className="text-stone-700 leading-relaxed">
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
              <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Leaf className="h-8 w-8 text-amber-700" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-4">Made from Natural Ingredients</h3>
              <p className="text-stone-600">
                Crafted with pure, locally-sourced ingredients, supporting sustainable practices.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-amber-700" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-4">Organic &amp; Premium Quality</h3>
              <p className="text-stone-600">
                100% organic, premium quality products for superior results and satisfaction.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-amber-700" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-4">Safe &amp; Effective</h3>
              <p className="text-stone-600">
                Gentle formulations that are safe for daily use and deliver effective results.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
