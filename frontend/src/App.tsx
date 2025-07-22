import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { CartPopup } from './components/CartPopup'
import { HomePage } from './pages/HomePage'
import { ProductsPage } from './pages/ProductsPage'
import { CoursesPage } from './pages/CoursesPage'
import { BlogPage } from './pages/BlogPage'
import { ResourcesPage } from './pages/ResourcesPage'
import { Toaster } from './components/ui/toaster'
import { useToast } from './hooks/use-toast'
import './App.css'

interface ShopInfo {
  name: string
  email: string
  domain: string
  currency: string
  money_format: string
  country_name: string
}

interface CartItem {
  id: number
  title: string
  price: string
  quantity: number
  image?: string
  variant_id?: number
}

function App() {
  const [shopInfo, setShopInfo] = useState<ShopInfo | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { toast } = useToast()

  const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000'

  useEffect(() => {
    fetchShopInfo()
  }, [])

  const fetchShopInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/api/shop`)
      const data = await response.json()
      setShopInfo(data.shop)
    } catch (error) {
      console.error('Error fetching shop info:', error)
    }
  }

  const addToCart = (product: any) => {
    const existingItem = cartItems.find(item => item.id === product.id)
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      const newItem: CartItem = {
        id: product.id,
        title: product.title,
        price: product.variants[0]?.price || '0.00',
        quantity: 1,
        image: product.images[0]?.src,
        variant_id: product.variants[0]?.id
      }
      setCartItems([...cartItems, newItem])
    }

    toast({
      title: "Added to Cart",
      description: `${product.title} has been added to your cart.`,
    })
  }

  const updateCartQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id)
    } else {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      ))
    }
  }

  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id))
    toast({
      title: "Removed from Cart",
      description: "Item has been removed from your cart.",
    })
  }

  const handleCheckout = () => {
    toast({
      title: "Checkout",
      description: "Redirecting to Shopify checkout...",
    })
    console.log('Proceeding to checkout with items:', cartItems)
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header 
        shopName={shopInfo?.name} 
        cartItems={cartItems} 
        onCartClick={() => setIsCartOpen(true)}
      />
      
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/products" 
            element={
              <ProductsPage 
                cartItems={cartItems.map(item => item.id)} 
                onAddToCart={addToCart}
              />
            } 
          />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
        </Routes>
      </main>

      <CartPopup
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />

      <Footer shopInfo={shopInfo || undefined} />
      <Toaster />
    </div>
  )
}

export default App
