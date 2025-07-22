import { useState, useEffect } from 'react'
import { ShoppingCart, Package, Heart } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useToast } from '../hooks/use-toast'

interface Product {
  id: number
  title: string
  body_html: string
  vendor: string
  product_type: string
  handle: string
  status: string
  images: Array<{
    id: number
    src: string
    alt: string
  }>
  variants: Array<{
    id: number
    title: string
    price: string
    inventory_quantity: number
    available: boolean
  }>
}

interface ProductsPageProps {
  cartItems: number[]
  onAddToCart: (product: Product) => void
}

export function ProductsPage({ cartItems, onAddToCart }: ProductsPageProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000'

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`)
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (product: Product) => {
    try {
      const response = await fetch(`${API_URL}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product.id,
          variant_id: product.variants[0]?.id,
          quantity: 1,
        }),
      })
      
      if (response.ok) {
        onAddToCart(product)
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 animate-spin text-amber-700 mx-auto mb-4" />
          <p className="text-lg text-stone-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Products Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-stone-900 mb-4">Our Products</h1>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto">
              Discover our carefully curated collection of natural products
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-stone-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-stone-900 mb-2">No products found</h3>
              <p className="text-stone-500">Check back later for new products!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.images[0]?.src || 'https://placehold.co/400x400/png'}
                      alt={product.images[0]?.alt || product.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl font-bold text-stone-900 line-clamp-2">{product.title}</CardTitle>
                      <Button variant="ghost" size="sm" className="shrink-0 text-stone-500 hover:text-amber-700">
                        <Heart className="h-5 w-5" />
                      </Button>
                    </div>
                    <CardDescription className="text-stone-600 font-medium">
                      by {product.vendor}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div 
                      className="text-stone-600 line-clamp-3 mb-6"
                      dangerouslySetInnerHTML={{ __html: product.body_html }}
                    />
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-col">
                        <span className="text-3xl font-bold text-stone-900">
                          ${product.variants[0]?.price || '0.00'}
                        </span>
                        <span className="text-sm text-stone-500">
                          {product.variants[0]?.inventory_quantity || 0} in stock
                        </span>
                      </div>
                      <Badge 
                        variant={product.status === 'active' ? 'default' : 'secondary'}
                        className={product.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                      >
                        {product.status}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      onClick={() => addToCart(product)}
                      disabled={!product.variants[0]?.available || cartItems.includes(product.id)}
                      className={`w-full py-3 font-semibold rounded-full transition-all duration-300 ${
                        cartItems.includes(product.id) 
                          ? 'bg-stone-400 text-white cursor-not-allowed' 
                          : 'bg-stone-900 hover:bg-amber-700 text-white'
                      }`}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      {cartItems.includes(product.id) ? 'Added to Cart' : 'Add to Cart'}
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
