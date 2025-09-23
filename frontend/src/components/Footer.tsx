import { Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'

interface FooterProps {
  shopInfo?: {
    name: string
    email: string
    domain?: string
    currency?: string
    money_format?: string
    country_name?: string
  }
}

export function Footer({ shopInfo }: FooterProps) {
  return (
    <footer className="bg-custom-dark text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <Leaf className="h-8 w-8 text-amber-400" />
              <h3 className="text-xl font-bold">Natural Store</h3>
            </div>
            <p className="text-stone-300 mb-6">
              At Natural Store, we offer a range of all-natural, high-quality products that provide a better alternative to conventional solutions.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6">Shop</h4>
            <ul className="space-y-3 text-stone-300">
              <li><Link to="/products" className="hover:text-amber-400 transition-colors">All Products</Link></li>
              <li><Link to="/courses" className="hover:text-amber-400 transition-colors">Courses &amp; Ebooks</Link></li>
              <li><Link to="/blog" className="hover:text-amber-400 transition-colors">Blog</Link></li>
              <li><Link to="/resources" className="hover:text-amber-400 transition-colors">Resources</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6">Reach out</h4>
            <p className="text-stone-300 mb-4">
              {shopInfo?.email || 'contact@naturalstore.com'}
            </p>
            <p className="text-stone-300">
              {shopInfo?.country_name && `Located in ${shopInfo.country_name}`}
            </p>
          </div>
        </div>
        <div className="border-t border-stone-700 mt-12 pt-8 text-center text-stone-400">
          <p>© 2024 - Natural Store • Powered by Shopify Integration</p>
        </div>
      </div>
    </footer>
  )
}
