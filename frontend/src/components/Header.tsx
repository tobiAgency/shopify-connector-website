import { ShoppingCart } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

interface CartItem {
  id: number
  title: string
  price: string
  quantity: number
  image?: string
  variant_id?: number
}

interface HeaderProps {
  cartItems: CartItem[]
  onCartClick: () => void
}

export function Header({ cartItems, onCartClick }: HeaderProps) {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)

  const isActive = (path: string) => {
    return location.pathname === path
  }

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.8
      setIsScrolled(window.scrollY > heroHeight)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isHomePage = location.pathname === '/'
  const shouldBeTransparent = isHomePage && !isScrolled

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      shouldBeTransparent 
        ? 'bg-transparent' 
        : 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-stone-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <img 
              src={shouldBeTransparent 
                ? "https://lgjmpmacuyfauwztwkuj.supabase.co/storage/v1/object/public/webiste//logo_white.png"
                : "https://lgjmpmacuyfauwztwkuj.supabase.co/storage/v1/object/public/webiste//logo_black.png"
              }
              alt="Misfit Health Logo"
              className="h-12 w-auto"
            />
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-medium transition-colors ${
                isActive('/') 
                  ? 'text-amber-700' 
                  : shouldBeTransparent 
                    ? 'text-white hover:text-amber-300' 
                    : 'text-stone-700 hover:text-amber-700'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`font-medium transition-colors ${
                isActive('/products') 
                  ? 'text-amber-700' 
                  : shouldBeTransparent 
                    ? 'text-white hover:text-amber-300' 
                    : 'text-stone-700 hover:text-amber-700'
              }`}
            >
              Products
            </Link>
            <Link 
              to="/courses" 
              className={`font-medium transition-colors ${
                isActive('/courses') 
                  ? 'text-amber-700' 
                  : shouldBeTransparent 
                    ? 'text-white hover:text-amber-300' 
                    : 'text-stone-700 hover:text-amber-700'
              }`}
            >
              Learn &amp; Grow
            </Link>
            <Link 
              to="/blog" 
              className={`font-medium transition-colors ${
                isActive('/blog') 
                  ? 'text-amber-700' 
                  : shouldBeTransparent 
                    ? 'text-white hover:text-amber-300' 
                    : 'text-stone-700 hover:text-amber-700'
              }`}
            >
              Learn &amp; Reflect
            </Link>
            <Link 
              to="/resources" 
              className={`font-medium transition-colors ${
                isActive('/resources') 
                  ? 'text-amber-700' 
                  : shouldBeTransparent 
                    ? 'text-white hover:text-amber-300' 
                    : 'text-stone-700 hover:text-amber-700'
              }`}
            >
              Resources
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <button 
              onClick={onCartClick}
              className={`relative p-2 rounded-full transition-colors ${
                shouldBeTransparent 
                  ? 'hover:bg-white/20' 
                  : 'hover:bg-stone-100'
              }`}
            >
              <ShoppingCart className={`h-6 w-6 ${
                shouldBeTransparent ? 'text-white' : 'text-stone-700'
              }`} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
