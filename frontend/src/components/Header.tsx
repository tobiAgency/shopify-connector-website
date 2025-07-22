import { ShoppingCart, Leaf } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

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

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Leaf className="h-8 w-8 text-amber-700" />
            <div>
              <Link to="/" className="text-xl font-bold text-stone-900 hover:text-amber-700">
                {shopName || 'Natural Store'}
              </Link>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-medium transition-colors ${
                isActive('/') ? 'text-amber-700' : 'text-stone-700 hover:text-amber-700'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`font-medium transition-colors ${
                isActive('/products') ? 'text-amber-700' : 'text-stone-700 hover:text-amber-700'
              }`}
            >
              Products
            </Link>
            <Link 
              to="/courses" 
              className={`font-medium transition-colors ${
                isActive('/courses') ? 'text-amber-700' : 'text-stone-700 hover:text-amber-700'
              }`}
            >
              Courses &amp; Ebooks
            </Link>
            <Link 
              to="/blog" 
              className={`font-medium transition-colors ${
                isActive('/blog') ? 'text-amber-700' : 'text-stone-700 hover:text-amber-700'
              }`}
            >
              Blog
            </Link>
            <Link 
              to="/resources" 
              className={`font-medium transition-colors ${
                isActive('/resources') ? 'text-amber-700' : 'text-stone-700 hover:text-amber-700'
              }`}
            >
              Resources
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <button 
              onClick={onCartClick}
              className="relative p-2 hover:bg-stone-100 rounded-full transition-colors"
            >
              <ShoppingCart className="h-6 w-6 text-stone-700" />
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
