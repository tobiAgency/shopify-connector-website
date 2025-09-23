import { Play, ArrowRight, Calendar, BookOpen, Headphones } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="min-h-screen bg-custom-dark text-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://lgjmpmacuyfauwztwkuj.supabase.co/storage/v1/object/public/webiste//header_image.mov" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-custom-dark/40"></div>
        <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4">
          <h1 className="text-7xl md:text-9xl font-bold mb-6 leading-tight tracking-wider">
            MISFIT HEALTH
          </h1>
          <p className="text-lg md:text-xl font-light mb-12 tracking-wide opacity-90">
            A ROADMAP TO THE HEROES JOURNEY
          </p>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="bg-custom-blue text-white py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-lg font-semibold">
            🔥 Limited Time: Transform Your Business in 2025 - Join Our Exclusive Masterclass
            <Link to="/courses" className="ml-4 underline hover:no-underline">
              Get Access Now
            </Link>
          </p>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-custom-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Shop Natural Skincare</h2>
            <Link to="/products" className="text-blue-400 hover:text-blue-300 font-semibold text-lg flex items-center justify-center gap-2">
              Discover Products <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          {/* Top row - 3 sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {[
              { 
                title: "Natural Skincare", 
                subtitle: "Skincare designed to restore health and vitality using only clean, natural ingredients.",
                image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop",
                link: "/products"
              },
              { 
                title: "Feel-Good Ingredients", 
                subtitle: "Formulated with nourishing components you can feel confident putting on your skin.",
                image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
                link: "/products"
              },
              { 
                title: "Grass-Fed Tallow", 
                subtitle: "Our tallow is sourced from locally raised, grass-fed and finished cattle for maximum purity and quality.",
                image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
                link: "/products"
              }
            ].map((program, index) => (
              <Link key={index} to={program.link} className="group">
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-4">
                  <img 
                    src={program.image} 
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-custom-dark/30 group-hover:bg-custom-dark/20 transition-colors duration-300"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{program.title}</h3>
                    <p className="text-sm opacity-90">{program.subtitle}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom row - 2 sections with different widths but same height */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Support for Small Farmers - 2/3 width */}
            <div className="lg:col-span-2">
              <Link to="/products" className="group h-full">
                <div className="relative overflow-hidden rounded-2xl h-64 mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&h=300&fit=crop"
                    alt="Support for Small Farmers"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-custom-dark/30 group-hover:bg-custom-dark/20 transition-colors duration-300"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">Support for Small Farmers</h3>
                    <p className="text-sm opacity-90">We work directly with small, ethical farms—strengthening local economies and communities.</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Eco-Friendly & Regenerative - 1/3 width */}
            <div className="lg:col-span-1">
              <Link to="/products" className="group h-full">
                <div className="relative overflow-hidden rounded-2xl h-64 mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"
                    alt="Eco-Friendly & Regenerative"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-custom-dark/30 group-hover:bg-custom-dark/20 transition-colors duration-300"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">Eco-Friendly & Regenerative</h3>
                    <p className="text-sm opacity-90">Our practices help restore ecosystems and honor the balance of nature.</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Master Life Section */}
      <section className="py-20 bg-custom-dark text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
            Self Mastery Tools
          </h2>
          <p className="text-xl mb-12 leading-relaxed">
            Learn the core tenets of holistic living and walk away with essential tools to master your life as you embark on the hero's journey—awakening to the true nature of yourself
          </p>
          <Link to="/courses">
            <Button 
              size="lg" 
              className="bg-custom-blue text-white hover:bg-custom-blue px-12 py-6 text-xl font-semibold rounded-full"
            >
              Start now
            </Button>
          </Link>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-20 bg-white text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Pillars for an Extraordinary Life</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {[
              { name: 'Mindset', link: '/courses' },
              { name: 'Wealth', link: '/courses' },
              { name: 'Health', link: '/courses' },
              { name: 'Relationships', link: '/courses' },
              { name: 'Business', link: '/courses' },
              { name: 'Leadership', link: '/courses' },
              { name: 'Happiness', link: '/courses' }
            ].map((pillar, index) => (
              <Link key={index} to={pillar.link} className="group text-center">
                <div className="bg-gray-100 rounded-2xl p-6 group-hover:bg-blue-50 transition-colors duration-300">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {pillar.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Celebrity Testimonials */}
      <section className="py-20 bg-custom-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-12">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" 
                alt="Success Story"
                className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
              />
              <blockquote className="text-2xl md:text-3xl font-light text-white mb-8 max-w-4xl mx-auto leading-relaxed">
                These strategies helped me discover what I am really made of. I have set new standards for myself, and I have taken my business and my life to a whole new level!
              </blockquote>
              <div className="text-lg font-semibold text-white">Sarah Johnson</div>
              <div className="text-blue-200">CEO, Tech Startup</div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {[
                { name: "Michael Chen", title: "Fortune 500 Executive", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
                { name: "Emma Rodriguez", title: "Bestselling Author", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" },
                { name: "David Thompson", title: "Olympic Athlete", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" },
                { name: "Lisa Park", title: "Investment Banker", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face" }
              ].map((person, index) => (
                <div key={index} className="text-center">
                  <img 
                    src={person.image} 
                    alt={person.name}
                    className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                  />
                  <div className="font-semibold text-white text-sm">{person.name}</div>
                  <div className="text-blue-200 text-xs">{person.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Founder Section */}
      <section className="py-20 bg-white text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=face" 
                alt="Founder"
                className="w-full rounded-2xl"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button className="bg-custom-blue text-white hover:bg-custom-blue rounded-full p-4">
                  <Play className="h-8 w-8" />
                </Button>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Do you have a hunger to increase the quality of your life?
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                We believe progress equals happiness. And no matter where you are looking to excel, we are here to help you forge your pathway to power. Meet the man who has spent over 45 years creating breakthroughs and transforming lives.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                My own health struggles—acne, eating disorders, and later anxiety—forced me to take ownership of my healing. After years of failed conventional treatments, I turned to natural approaches and eventually found a mentor, Paul Chek, who helped me realize that true health is the integration of mind, body, and spirit. Through daily practice and refinement, I transformed not only my physical health but also my mental well-being and sense of purpose. Now, I help others do the same—building strong foundations for lasting change and living fully and authentically.
              </p>

              <Link to="/courses">
                <Button className="bg-custom-dark text-white hover:bg-custom-dark px-8 py-3 rounded-full">
                  Meet the Founder
                </Button>
              </Link>
              
              <div className="mt-12">
                <p className="text-sm text-gray-600 mb-4">Featured in:</p>
                <div className="flex items-center gap-8 opacity-60">
                  <span className="text-2xl font-bold">Forbes</span>
                  <span className="text-2xl font-bold">FORTUNE</span>
                  <span className="text-2xl font-bold">Inc.</span>
                  <span className="text-2xl font-bold">SUCCESS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 bg-custom-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-8">Results that speak for themselves</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-custom-blue mb-2">50M+</div>
                <div className="text-lg">Lives Transformed</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-custom-blue mb-2">4M+</div>
                <div className="text-lg">Event Attendees</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-custom-blue mb-2">100+</div>
                <div className="text-lg">Countries Reached</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Programs */}
      <section className="py-20 bg-white text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Upcoming Programs</h2>
            <p className="text-xl text-gray-600">Transform your life with our world-class events</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Business Mastery",
                date: "March 15-18, 2025",
                location: "Las Vegas, NV",
                price: "$2,995",
                image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=250&fit=crop"
              },
              {
                title: "Unleash the Power Within",
                date: "April 22-25, 2025",
                location: "New York, NY",
                price: "$1,495",
                image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop"
              },
              {
                title: "Date with Destiny",
                date: "May 10-16, 2025",
                location: "Palm Beach, FL",
                price: "$4,995",
                image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=250&fit=crop"
              }
            ].map((event, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="text-gray-600 mb-4">{event.location}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-custom-blue">{event.price}</span>
                    <Link to="/courses">
                      <Button className="bg-custom-blue text-white hover:bg-custom-blue px-6 py-2 rounded-full">
                        Register
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Guidance */}
      <section className="py-20 bg-custom-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold mb-8">Expert guidance when you need it most</h2>
              <p className="text-xl mb-8 leading-relaxed">
                Get personalized coaching and support from our team of certified coaches and trainers.
              </p>
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">98%</div>
                  <div className="text-sm">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">24/7</div>
                  <div className="text-sm">Support Available</div>
                </div>
              </div>
              <Link to="/courses">
                <Button className="bg-white text-custom-blue hover:bg-gray-100 px-8 py-3 rounded-full font-semibold">
                  Get Coaching
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop" 
                alt="Coaching"
                className="w-full rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Shop */}
      <section className="py-20 bg-white text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Transform your life today</h2>
            <p className="text-xl text-gray-600">Discover our collection of life-changing programs and resources</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Personal Power",
                type: "Audio Program",
                price: "$199",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
              },
              {
                title: "Money Master",
                type: "Digital Course",
                price: "$299",
                image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&h=300&fit=crop"
              },
              {
                title: "Relationship Breakthrough",
                type: "Video Series",
                price: "$149",
                image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=300&fit=crop"
              },
              {
                title: "Peak Performance",
                type: "Complete System",
                price: "$399",
                image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop"
              }
            ].map((product, index) => (
              <Link key={index} to="/products" className="group">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{product.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{product.type}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-custom-blue">{product.price}</span>
                      <Button className="bg-custom-blue text-white hover:bg-custom-blue px-4 py-2 rounded-full text-sm">
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Podcast Section */}
      <section className="py-20 bg-custom-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Latest Insights</h2>
            <p className="text-xl text-gray-300">Stay inspired with our latest content</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "The Psychology of Success",
                type: "Podcast Episode",
                duration: "45 min",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&crop=face"
              },
              {
                title: "Building Wealth in 2025",
                type: "Blog Article",
                duration: "8 min read",
                image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&h=200&fit=crop"
              },
              {
                title: "Leadership Mastery",
                type: "Video",
                duration: "22 min",
                image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop"
              }
            ].map((content, index) => (
              <Link key={index} to="/blog" className="group">
                <div className="bg-gray-800 rounded-2xl overflow-hidden hover:bg-gray-700 transition-colors duration-300">
                  <div className="relative">
                    <img 
                      src={content.image} 
                      alt={content.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      {content.type === "Podcast Episode" ? (
                        <Headphones className="h-12 w-12 text-white opacity-80" />
                      ) : content.type === "Video" ? (
                        <Play className="h-12 w-12 text-white opacity-80" />
                      ) : (
                        <BookOpen className="h-12 w-12 text-white opacity-80" />
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2">{content.title}</h3>
                    <div className="flex items-center justify-between text-gray-300 text-sm">
                      <span>{content.type}</span>
                      <span>{content.duration}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-custom-blue text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
            Ready to live an extraordinary life?
          </h2>
          <p className="text-xl mb-12 leading-relaxed">
            Join millions who have transformed their lives. Your extraordinary life starts now.
          </p>
          <Link to="/courses">
            <Button 
              size="lg" 
              className="bg-white text-custom-blue hover:bg-gray-100 px-12 py-6 text-xl font-semibold rounded-full"
            >
              Start Your Journey
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
