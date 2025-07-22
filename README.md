# Shopify Connector Website

A fullstack web application that connects to Shopify with a FastAPI backend and React frontend, featuring a natural/organic design aesthetic inspired by Misfit Health.

## 🌐 Live Demo

- **Website:** https://shopify-connector-website-ulpnjc3j.devinapps.com/
- **Backend API:** https://app-rvfpljhr.fly.dev/

## ✨ Features

### Frontend
- **Multi-page React application** with Home, Products, Courses & Ebooks, Blog, and Resources pages
- **Natural/organic design** with earthy color scheme and clean typography
- **Cart popup functionality** - click the cart icon to view, modify, and checkout items
- **Responsive design** optimized for desktop and mobile
- **Testimonials section** on the homepage
- **Supabase integration** for dynamic content management
- **Toast notifications** for user feedback

### Backend
- **FastAPI REST API** with Shopify integration
- **Product management** - fetch products, collections, and shop information
- **Cart functionality** - add items, manage quantities, and checkout
- **Demo data fallback** when Shopify credentials are not configured
- **CORS enabled** for frontend integration

### Cart Popup Features
- View cart items with product images, titles, and prices
- Adjust quantities using + and - buttons
- Remove items with trash icon
- Calculate totals (subtotal, tax, and total)
- Proceed to checkout or continue shopping
- Empty cart state with encouraging message

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **Lucide React** for icons
- **Supabase** for database integration

### Backend
- **FastAPI** with Python
- **Poetry** for dependency management
- **Shopify Python API** for integration
- **Python-dotenv** for environment variables
- **Requests** for HTTP calls

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and pnpm/npm
- Python 3.12+ and Poetry
- Shopify store with API credentials (optional - demo data available)
- Supabase project (optional - for dynamic content)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
poetry install
```

3. Create a `.env` file with your Shopify credentials:
```env
SHOPIFY_SHOP_URL=your-shop-name.myshopify.com
SHOPIFY_ACCESS_TOKEN=your-shopify-access-token
SHOPIFY_API_VERSION=2023-10
```

4. Start the development server:
```bash
poetry run fastapi dev app/main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Start the development server:
```bash
npm run dev
```

The website will be available at `http://localhost:5173`

## 📡 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{product_id}` - Get specific product
- `GET /api/collections` - Get all collections

### Shop
- `GET /api/shop` - Get shop information

### Cart
- `POST /api/cart/add` - Add item to cart

### Health
- `GET /healthz` - Health check endpoint

## 🎨 Design System

The website uses a natural/organic design aesthetic with:
- **Colors:** Stone grays, amber accents, and earthy tones
- **Typography:** Clean, readable fonts with proper hierarchy
- **Layout:** Spacious, breathing room with natural imagery
- **Components:** Rounded corners, subtle shadows, and smooth transitions

## 🗄️ Database Schema

### Supabase Tables (Optional)
- **courses** - Course and ebook content
- **blog_posts** - Blog articles and newsletter content  
- **resources** - Resource page content

## 🚀 Deployment

### Backend (Fly.io)
```bash
cd backend
poetry run fastapi build
# Deploy using Fly.io CLI or deployment service
```

### Frontend (Static Hosting)
```bash
cd frontend
npm run build
# Deploy the dist/ folder to your hosting service
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
SHOPIFY_SHOP_URL=your-shop-name.myshopify.com
SHOPIFY_ACCESS_TOKEN=your-shopify-access-token
SHOPIFY_API_VERSION=2023-10
```

#### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.com
VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 🧪 Testing

### Backend
```bash
cd backend
poetry run pytest
```

### Frontend
```bash
cd frontend
npm run test
```

## 📝 Development Notes

- The application uses demo data when Shopify credentials are not configured
- Cart functionality includes local state management with toast notifications
- The design is responsive and optimized for both desktop and mobile
- Supabase integration allows for dynamic content management on blog, courses, and resources pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Design inspiration from [Misfit Health](https://www.misfit-health.com/)
- Built with modern web technologies and best practices
- Deployed and tested for production use

---

**Link to Devin run:** https://app.devin.ai/sessions/ea70d0f1491540fcb10ca00987bcae4c  
**Requested by:** @tobiAgency
