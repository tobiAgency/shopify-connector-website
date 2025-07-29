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
  shopName?: string
  cartItems: CartItem[]
  onCartClick: () => void
}

export function Header({ shopName, cartItems, onCartClick }: HeaderProps) {
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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-stone-200' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <img 
              src={isScrolled 
                ? "https://lgjmpmacuyfauwztwkuj.supabase.co/storage/v1/object/public/webiste//logo_black.png"
                : "https://lgjmpmacuyfauwztwkuj.supabase.co/storage/v1/object/public/webiste//logo_white.png"
              }
              alt="Misfit Health Logo"
              className="h-8 w-auto"
            />
            <div>
              <Link to="/" className={`text-xl font-bold transition-colors ${
                isScrolled 
                  ? 'text-stone-900 hover:text-amber-700' 
                  : 'text-white hover:text-amber-300'
              }`}>
                {shopName || 'Misfit Health'}
              </Link>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-medium transition-colors ${
                isActive('/') 
                  ? 'text-amber-700' 
                  : isScrolled 
                    ? 'text-stone-700 hover:text-amber-700' 
                    : 'text-white hover:text-amber-300'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`font-medium transition-colors ${
                isActive('/products') 
                  ? 'text-amber-700' 
                  : isScrolled 
                    ? 'text-stone-700 hover:text-amber-700' 
                    : 'text-white hover:text-amber-300'
              }`}
            >
              Products
            </Link>
            <Link 
              to="/courses" 
              className={`font-medium transition-colors ${
                isActive('/courses') 
                  ? 'text-amber-700' 
                  : isScrolled 
                    ? 'text-stone-700 hover:text-amber-700' 
                    : 'text-white hover:text-amber-300'
              }`}
            >
              Courses &amp; Ebooks
            </Link>
            <Link 
              to="/blog" 
              className={`font-medium transition-colors ${
                isActive('/blog') 
                  ? 'text-amber-700' 
                  : isScrolled 
                    ? 'text-stone-700 hover:text-amber-700' 
                    : 'text-white hover:text-amber-300'
              }`}
            >
              Blog
            </Link>
            <Link 
              to="/resources" 
              className={`font-medium transition-colors ${
                isActive('/resources') 
                  ? 'text-amber-700' 
                  : isScrolled 
                    ? 'text-stone-700 hover:text-amber-700' 
                    : 'text-white hover:text-amber-300'
              }`}
            >
              Resources
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <button 
              onClick={onCartClick}
              className={`relative p-2 rounded-full transition-colors ${
                isScrolled 
                  ? 'hover:bg-stone-100' 
                  : 'hover:bg-white/20'
              }`}
            >
              <ShoppingCart className={`h-6 w-6 ${
                isScrolled ? 'text-stone-700' : 'text-white'
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
