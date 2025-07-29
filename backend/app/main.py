from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import requests
import os
from dotenv import load_dotenv, set_key
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI(title="Shopify Connector API", version="1.0.0")

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

SHOPIFY_SHOP_URL = os.getenv("SHOPIFY_SHOP_URL", "")
SHOPIFY_ACCESS_TOKEN = os.getenv("SHOPIFY_ACCESS_TOKEN", "")
SHOPIFY_API_VERSION = os.getenv("SHOPIFY_API_VERSION", "2023-10")

ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN")
security = HTTPBearer()

class AdminLoginRequest(BaseModel):
    password: str

class AdminConfigRequest(BaseModel):
    config: Dict[str, str]

class CourseRequest(BaseModel):
    title: str
    description: str
    price: float
    image_url: str
    category: str

class BlogPostRequest(BaseModel):
    title: str
    content: str
    excerpt: str
    author: str
    published_at: Optional[str] = None

class ResourceRequest(BaseModel):
    title: str
    description: str
    file_url: str
    category: str

def verify_admin_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials.credentials != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid admin token")
    return credentials

def get_shopify_headers():
    return {
        "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json"
    }

def make_shopify_request(endpoint: str, method: str = "GET", data: Optional[Dict] = None):
    url = f"https://{SHOPIFY_SHOP_URL}/admin/api/{SHOPIFY_API_VERSION}/{endpoint}"
    headers = get_shopify_headers()
    
    logger.info(f"Making Shopify API request to: {url}")
    
    try:
        if method == "GET":
            response = requests.get(url, headers=headers)
        elif method == "POST":
            response = requests.post(url, headers=headers, json=data)
        elif method == "PUT":
            response = requests.put(url, headers=headers, json=data)
        elif method == "DELETE":
            response = requests.delete(url, headers=headers)
        
        logger.info(f"Shopify API response status: {response.status_code}")
        
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"Shopify API error: Status {response.status_code if 'response' in locals() else 'N/A'}, Error: {str(e)}")
        if 'response' in locals():
            logger.error(f"Response body: {response.text}")
        raise HTTPException(status_code=500, detail=f"Shopify API error: {str(e)}")

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.get("/api/products")
async def get_products(limit: int = 50):
    """Get products from Shopify store"""
    try:
        data = make_shopify_request(f"products.json?limit={limit}")
        logger.info(f"Successfully retrieved {len(data.get('products', []))} products from Shopify")
        return {"products": data.get("products", [])}
    except Exception as e:
        logger.warning(f"Failed to retrieve products from Shopify, falling back to demo data. Error: {str(e)}")
        return {
            "products": [
                {
                    "id": 1,
                    "title": "Demo Product 1",
                    "body_html": "This is a demo product for testing purposes.",
                    "vendor": "Demo Vendor",
                    "product_type": "Demo Type",
                    "handle": "demo-product-1",
                    "status": "active",
                    "images": [
                        {
                            "id": 1,
                            "src": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
                            "alt": "Demo Product 1"
                        }
                    ],
                    "variants": [
                        {
                            "id": 1,
                            "title": "Default Title",
                            "price": "29.99",
                            "inventory_quantity": 100,
                            "available": True
                        }
                    ]
                },
                {
                    "id": 2,
                    "title": "Demo Product 2",
                    "body_html": "Another demo product for testing purposes.",
                    "vendor": "Demo Vendor",
                    "product_type": "Demo Type",
                    "handle": "demo-product-2",
                    "status": "active",
                    "images": [
                        {
                            "id": 2,
                            "src": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
                            "alt": "Demo Product 2"
                        }
                    ],
                    "variants": [
                        {
                            "id": 2,
                            "title": "Default Title",
                            "price": "49.99",
                            "inventory_quantity": 50,
                            "available": True
                        }
                    ]
                },
                {
                    "id": 3,
                    "title": "Demo Product 3",
                    "body_html": "A third demo product for testing purposes.",
                    "vendor": "Demo Vendor",
                    "product_type": "Demo Type",
                    "handle": "demo-product-3",
                    "status": "active",
                    "images": [
                        {
                            "id": 3,
                            "src": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
                            "alt": "Demo Product 3"
                        }
                    ],
                    "variants": [
                        {
                            "id": 3,
                            "title": "Default Title",
                            "price": "19.99",
                            "inventory_quantity": 75,
                            "available": True
                        }
                    ]
                }
            ]
        }

@app.get("/api/products/{product_id}")
async def get_product(product_id: int):
    """Get a specific product from Shopify store"""
    try:
        data = make_shopify_request(f"products/{product_id}.json")
        return {"product": data.get("product", {})}
    except Exception as e:
        raise HTTPException(status_code=404, detail="Product not found")

@app.get("/api/collections")
async def get_collections():
    """Get collections from Shopify store"""
    try:
        data = make_shopify_request("collections.json")
        return {"collections": data.get("collections", [])}
    except Exception as e:
        return {
            "collections": [
                {
                    "id": 1,
                    "title": "Featured Products",
                    "handle": "featured-products",
                    "body_html": "Our featured product collection"
                },
                {
                    "id": 2,
                    "title": "New Arrivals",
                    "handle": "new-arrivals",
                    "body_html": "Latest products in our store"
                }
            ]
        }

@app.post("/api/cart/add")
async def add_to_cart(item: Dict[str, Any]):
    """Add item to cart (simplified for demo)"""
    return {
        "success": True,
        "message": "Item added to cart",
        "item": item
    }

@app.get("/api/shop")
async def get_shop_info():
    """Get shop information"""
    try:
        data = make_shopify_request("shop.json")
        return {"shop": data.get("shop", {})}
    except Exception as e:
        return {
            "shop": {
                "name": "Demo Shopify Store",
                "email": "demo@example.com",
                "domain": "demo-shop.myshopify.com",
                "currency": "USD",
                "money_format": "${{amount}}",
                "country_name": "United States"
            }
        }

@app.post("/api/admin/login")
async def admin_login(request: AdminLoginRequest):
    """Admin login endpoint"""
    if request.password == ADMIN_PASSWORD:
        return {"success": True, "token": ADMIN_TOKEN}
    else:
        raise HTTPException(status_code=401, detail="Invalid password")

@app.get("/api/admin/config")
async def get_admin_config(credentials: HTTPAuthorizationCredentials = Depends(verify_admin_token)):
    """Get current configuration"""
    return {
        "config": {
            "shopify_shop_url": SHOPIFY_SHOP_URL,
            "shopify_access_token": SHOPIFY_ACCESS_TOKEN,
            "shopify_api_version": SHOPIFY_API_VERSION,
            "supabase_url": os.getenv("VITE_SUPABASE_URL", ""),
            "supabase_anon_key": os.getenv("VITE_SUPABASE_ANON_KEY", "")
        }
    }

@app.post("/api/admin/config")
async def update_admin_config(request: AdminConfigRequest, credentials: HTTPAuthorizationCredentials = Depends(verify_admin_token)):
    """Update configuration"""
    global SHOPIFY_SHOP_URL, SHOPIFY_ACCESS_TOKEN, SHOPIFY_API_VERSION
    
    config = request.config
    is_deployment = os.getenv("FLY_APP_NAME") is not None
    
    try:
        if "shopify_shop_url" in config:
            SHOPIFY_SHOP_URL = config["shopify_shop_url"]
            
        if "shopify_access_token" in config:
            SHOPIFY_ACCESS_TOKEN = config["shopify_access_token"]
            
        if "shopify_api_version" in config:
            SHOPIFY_API_VERSION = config["shopify_api_version"]
        
        if "supabase_url" in config:
            os.environ["VITE_SUPABASE_URL"] = config["supabase_url"]
            
        if "supabase_anon_key" in config:
            os.environ["VITE_SUPABASE_ANON_KEY"] = config["supabase_anon_key"]
        
        if is_deployment:
            secrets_needed = []
            if "shopify_shop_url" in config:
                secrets_needed.append(f"SHOPIFY_SHOP_URL={config['shopify_shop_url']}")
            if "shopify_access_token" in config:
                secrets_needed.append(f"SHOPIFY_ACCESS_TOKEN={config['shopify_access_token']}")
            if "shopify_api_version" in config:
                secrets_needed.append(f"SHOPIFY_API_VERSION={config['shopify_api_version']}")
            if "supabase_url" in config:
                secrets_needed.append(f"VITE_SUPABASE_URL={config['supabase_url']}")
            if "supabase_anon_key" in config:
                secrets_needed.append(f"VITE_SUPABASE_ANON_KEY={config['supabase_anon_key']}")
            
            return {
                "success": True, 
                "message": "Configuration updated for current session. For permanent storage, set these Fly.io secrets:",
                "secrets_command": f"flyctl secrets set {' '.join(secrets_needed)} --app shopify-connector-backend",
                "note": "Configuration will persist until server restart. Use the secrets command for permanent storage."
            }
        else:
            env_file_path = os.path.join(os.path.dirname(__file__), "..", ".env")
            
            if "shopify_shop_url" in config:
                set_key(env_file_path, "SHOPIFY_SHOP_URL", config["shopify_shop_url"])
                
            if "shopify_access_token" in config:
                set_key(env_file_path, "SHOPIFY_ACCESS_TOKEN", config["shopify_access_token"])
                
            if "shopify_api_version" in config:
                set_key(env_file_path, "SHOPIFY_API_VERSION", config["shopify_api_version"])
            
            if "supabase_url" in config:
                set_key(env_file_path, "VITE_SUPABASE_URL", config["supabase_url"])
                
            if "supabase_anon_key" in config:
                set_key(env_file_path, "VITE_SUPABASE_ANON_KEY", config["supabase_anon_key"])
            
            return {"success": True, "message": "Configuration updated and saved permanently to .env file"}
        
    except Exception as e:
        logger.error(f"Failed to update configuration: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update configuration: {str(e)}")

@app.get("/api/admin/test-shopify")
async def test_shopify_connection(credentials: HTTPAuthorizationCredentials = Depends(verify_admin_token)):
    """Test Shopify API connectivity and return detailed status"""
    is_deployment = os.getenv("FLY_APP_NAME") is not None
    
    try:
        if not SHOPIFY_SHOP_URL or not SHOPIFY_ACCESS_TOKEN:
            return {
                "success": False,
                "message": "Shopify credentials not configured",
                "error": "Please configure your Shopify shop URL and access token before testing the connection",
                "current_config": {
                    "shop_url": SHOPIFY_SHOP_URL or "(not set)",
                    "api_version": SHOPIFY_API_VERSION,
                    "token_configured": bool(SHOPIFY_ACCESS_TOKEN)
                },
                "persistence_note": "In deployment, use Fly.io secrets for permanent storage" if is_deployment else "Configuration saved to .env file"
            }
            
        data = make_shopify_request("shop.json")
        return {
            "success": True,
            "message": "Shopify API connection successful",
            "shop_name": data.get("shop", {}).get("name", "Unknown"),
            "shop_domain": data.get("shop", {}).get("domain", "Unknown"),
            "persistence_status": "Using Fly.io secrets" if is_deployment else "Using .env file"
        }
    except HTTPException as e:
        return {
            "success": False,
            "message": "Shopify API connection failed",
            "error": e.detail,
            "current_config": {
                "shop_url": SHOPIFY_SHOP_URL,
                "api_version": SHOPIFY_API_VERSION,
                "token_length": len(SHOPIFY_ACCESS_TOKEN) if SHOPIFY_ACCESS_TOKEN else 0
            },
            "persistence_note": "In deployment, use Fly.io secrets for permanent storage" if is_deployment else "Configuration saved to .env file"
        }
    except Exception as e:
        return {
            "success": False,
            "message": "Unexpected error testing Shopify connection",
            "error": str(e)
        }

@app.get("/api/admin/test-supabase")
async def test_supabase_connection(credentials: HTTPAuthorizationCredentials = Depends(verify_admin_token)):
    """Test Supabase connectivity and return detailed status"""
    try:
        supabase_url = os.getenv("VITE_SUPABASE_URL", "")
        supabase_anon_key = os.getenv("VITE_SUPABASE_ANON_KEY", "")
        
        if not supabase_url or not supabase_anon_key:
            return {
                "success": False,
                "message": "Supabase credentials not configured",
                "error": "Missing Supabase URL or anonymous key",
                "current_config": {
                    "url_configured": bool(supabase_url),
                    "key_configured": bool(supabase_anon_key)
                }
            }
        
        headers = {
            "apikey": supabase_anon_key,
            "Authorization": f"Bearer {supabase_anon_key}",
            "Content-Type": "application/json"
        }
        
        test_url = f"{supabase_url}/rest/v1/"
        logger.info(f"Testing Supabase connection to: {test_url}")
        
        response = requests.get(test_url, headers=headers, timeout=10)
        logger.info(f"Supabase response status: {response.status_code}")
        
        if response.status_code == 200:
            return {
                "success": True,
                "message": "Supabase connection successful",
                "url": supabase_url,
                "status_code": response.status_code
            }
        else:
            return {
                "success": False,
                "message": "Supabase connection failed",
                "error": f"HTTP {response.status_code}: {response.text}",
                "current_config": {
                    "url": supabase_url,
                    "key_length": len(supabase_anon_key) if supabase_anon_key else 0
                }
            }
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Supabase connection error: {str(e)}")
        return {
            "success": False,
            "message": "Supabase connection failed",
            "error": f"Network error: {str(e)}",
            "current_config": {
                "url": os.getenv("VITE_SUPABASE_URL", ""),
                "key_length": len(os.getenv("VITE_SUPABASE_ANON_KEY", ""))
            }
        }
    except Exception as e:
        logger.error(f"Unexpected Supabase test error: {str(e)}")
        return {
            "success": False,
            "message": "Unexpected error testing Supabase connection",
            "error": str(e)
        }

@app.get("/api/admin/courses")
async def get_admin_courses(credentials: HTTPAuthorizationCredentials = Depends(verify_admin_token)):
    """Get all courses for admin management"""
    try:
        supabase_url = os.getenv("VITE_SUPABASE_URL", "")
        supabase_anon_key = os.getenv("VITE_SUPABASE_ANON_KEY", "")
        
        if not supabase_url or not supabase_anon_key:
            return {"courses": []}
            
        headers = {
            "apikey": supabase_anon_key,
            "Authorization": f"Bearer {supabase_anon_key}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(f"{supabase_url}/rest/v1/courses?select=*&order=created_at.desc", headers=headers)
        if response.status_code == 200:
            return {"courses": response.json()}
        else:
            logger.error(f"Supabase error fetching courses: {response.status_code} - {response.text}")
            return {"courses": []}
    except Exception as e:
        logger.error(f"Error fetching courses: {str(e)}")
        return {"courses": []}

@app.get("/api/courses")
async def get_courses():
    """Get all courses for public access"""
    try:
        supabase_url = os.getenv("VITE_SUPABASE_URL", "")
        supabase_anon_key = os.getenv("VITE_SUPABASE_ANON_KEY", "")
        
        if not supabase_url or not supabase_anon_key:
            return {"courses": []}
            
        headers = {
            "apikey": supabase_anon_key,
            "Authorization": f"Bearer {supabase_anon_key}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(f"{supabase_url}/rest/v1/courses?select=*&order=created_at.desc", headers=headers)
        if response.status_code == 200:
            return {"courses": response.json()}
        else:
            logger.error(f"Supabase error fetching courses: {response.status_code} - {response.text}")
            return {"courses": []}
    except Exception as e:
        logger.error(f"Error fetching courses: {str(e)}")
        return {"courses": []}

@app.get("/api/blogs")
async def get_blogs():
    """Get all blog posts for public access"""
    try:
        supabase_url = os.getenv("VITE_SUPABASE_URL", "")
        supabase_anon_key = os.getenv("VITE_SUPABASE_ANON_KEY", "")
        
        if not supabase_url or not supabase_anon_key:
            return {"blogs": []}
            
        headers = {
            "apikey": supabase_anon_key,
            "Authorization": f"Bearer {supabase_anon_key}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(f"{supabase_url}/rest/v1/blog_posts?select=*&order=published_at.desc", headers=headers)
        if response.status_code == 200:
            return {"blogs": response.json()}
        else:
            logger.error(f"Supabase error fetching blog posts: {response.status_code} - {response.text}")
            return {"blogs": []}
    except Exception as e:
        logger.error(f"Error fetching blog posts: {str(e)}")
        return {"blogs": []}

@app.get("/api/resources")
async def get_resources():
    """Get all resources for public access"""
    try:
        supabase_url = os.getenv("VITE_SUPABASE_URL", "")
        supabase_anon_key = os.getenv("VITE_SUPABASE_ANON_KEY", "")
        
        if not supabase_url or not supabase_anon_key:
            return {"resources": []}
            
        headers = {
            "apikey": supabase_anon_key,
            "Authorization": f"Bearer {supabase_anon_key}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(f"{supabase_url}/rest/v1/resources?select=*&order=created_at.desc", headers=headers)
        if response.status_code == 200:
            return {"resources": response.json()}
        else:
            logger.error(f"Supabase error fetching resources: {response.status_code} - {response.text}")
            return {"resources": []}
    except Exception as e:
        logger.error(f"Error fetching resources: {str(e)}")
        return {"resources": []}

@app.post("/api/admin/courses")
async def create_course(request: CourseRequest, credentials: HTTPAuthorizationCredentials = Depends(verify_admin_token)):
    """Create a new course"""
    try:
        supabase_url = os.getenv("VITE_SUPABASE_URL", "")
        supabase_anon_key = os.getenv("VITE_SUPABASE_ANON_KEY", "")
        
        logger.info(f"Creating course with data: {request.dict()}")
        logger.info(f"Supabase URL: {supabase_url}")
        logger.info(f"Supabase key length: {len(supabase_anon_key) if supabase_anon_key else 0}")
        
        if not supabase_url or not supabase_anon_key:
            raise HTTPException(status_code=400, detail="Supabase not configured")
            
        headers = {
            "apikey": supabase_anon_key,
            "Authorization": f"Bearer {supabase_anon_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "title": request.title,
            "description": request.description,
            "price": request.price,
            "image_url": request.image_url,
            "category": request.category
        }
        
        logger.info(f"Making POST request to: {supabase_url}/rest/v1/courses")
        response = requests.post(f"{supabase_url}/rest/v1/courses", headers=headers, json=data)
        logger.info(f"Supabase response status: {response.status_code}")
        logger.info(f"Supabase response body: {response.text}")
        
        if response.status_code == 201:
            return {"success": True, "message": "Course created successfully"}
        else:
            logger.error(f"Supabase error creating course: {response.status_code} - {response.text}")
            raise HTTPException(status_code=500, detail="Failed to create course")
    except Exception as e:
        logger.error(f"Error creating course: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create course: {str(e)}")

@app.put("/api/admin/courses/{course_id}")
async def update_course(course_id: int, request: CourseRequest, credentials: HTTPAuthorizationCredentials = Depends(verify_admin_token)):
    """Update an existing course"""
    try:
        supabase_url = os.getenv("VITE_SUPABASE_URL", "")
        supabase_anon_key = os.getenv("VITE_SUPABASE_ANON_KEY", "")
        
        if not supabase_url or not supabase_anon_key:
            raise HTTPException(status_code=400, detail="Supabase not configured")
            
        headers = {
            "apikey": supabase_anon_key,
            "Authorization": f"Bearer {supabase_anon_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "title": request.title,
            "description": request.description,
            "price": request.price,
            "image_url": request.image_url,
            "category": request.category
        }
        
        response = requests.patch(f"{supabase_url}/rest/v1/courses?id=eq.{course_id}", headers=headers, json=data)
        if response.status_code == 204:
            return {"success": True, "message": "Course updated successfully"}
        else:
            logger.error(f"Supabase error updating course: {response.status_code} - {response.text}")
            raise HTTPException(status_code=500, detail="Failed to update course")
    except Exception as e:
        logger.error(f"Error updating course: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update course: {str(e)}")

@app.delete("/api/admin/courses/{course_id}")
async def delete_course(course_id: int, credentials: HTTPAuthorizationCredentials = Depends(verify_admin_token)):
    """Delete a course"""
    try:
        supabase_url = os.getenv("VITE_SUPABASE_URL", "")
        supabase_anon_key = os.getenv("VITE_SUPABASE_ANON_KEY", "")
        
        if not supabase_url or not supabase_anon_key:
            raise HTTPException(status_code=400, detail="Supabase not configured")
            
        headers = {
            "apikey": supabase_anon_key,
            "Authorization": f"Bearer {supabase_anon_key}",
            "Content-Type": "application/json"
        }
        
        response = requests.delete(f"{supabase_url}/rest/v1/courses?id=eq.{course_id}", headers=headers)
        if response.status_code == 204:
            return {"success": True, "message": "Course deleted successfully"}
        else:
            logger.error(f"Supabase error deleting course: {response.status_code} - {response.text}")
            raise HTTPException(status_code=500, detail="Failed to delete course")
    except Exception as e:
        logger.error(f"Error deleting course: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete course: {str(e)}")

@app.get("/api/admin/blogs")
async def get_admin_blogs(credentials: HTTPAuthorizationCredentials = Depends(verify_admin_token)):
    """Get all blog posts for admin management"""
    try:
        supabase_url = os.getenv("VITE_SUPABASE_URL", "")
        supabase_anon_key = os.getenv("VITE_SUPABASE_ANON_KEY", "")
        
        if not supabase_url or not supabase_anon_key:
            return {"blogs": []}
            
        headers = {
            "apikey": supabase_anon_key,
            "Authorization": f"Bearer {supabase_anon_key}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(f"{supabase_url}/rest/v1/blog_posts?select=*&order=created_at.desc", headers=headers)
        if response.status_code == 200:
            return {"blogs": response.json()}
        else:
            logger.error(f"Supabase error fetching blogs: {response.status_code} - {response.text}")
            return {"blogs": []}
    except Exception as e:
        logger.error(f"Error fetching blogs: {str(e)}")
        return {"blogs": []}

@app.post("/api/admin/blogs")
async def create_blog(request: BlogPostRequest, credentials: HTTPAuthorizationCredentials = Depends(verify_admin_token)):
    """Create a new blog post"""
    try:
        supabase_url = os.getenv("VITE_SUPABASE_URL", "")
        supabase_anon_key = os.getenv("VITE_SUPABASE_ANON_KEY", "")
        
        if not supabase_url or not supabase_anon_key:
            raise HTTPException(status_code=400, detail="Supabase not configured")
            
        headers = {
            "apikey": supabase_anon_key,
            "Authorization": f"Bearer {supabase_anon_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "title": request.title,
            "content": request.content,
            "excerpt": request.excerpt,
            "author": request.author,
            "published_at": request.published_at or None
        }
        
        response = requests.post(f"{supabase_url}/rest/v1/blog_posts", headers=headers, json=data)
        if response.status_code == 201:
            return {"success": True, "message": "Blog post created successfully"}
        else:
            logger.error(f"Supabase error creating blog: {response.status_code} - {response.text}")
            raise HTTPException(status_code=500, detail="Failed to create blog post")
    except Exception as e:
        logger.error(f"Error creating blog: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create blog post: {str(e)}")

@app.put("/api/admin/blogs/{blog_id}")
async def update_blog(blog_id: int, request: BlogPostRequest, credentials: HTTPAuthorizationCredentials = Depends(verify_admin_token)):
    """Update an existing blog post"""
    try:
        supabase_url = os.getenv("VITE_SUPABASE_URL", "")
        supabase_anon_key = os.getenv("VITE_SUPABASE_ANON_KEY", "")
        
        if not supabase_url or not supabase_anon_key:
            raise HTTPException(status_code=400, detail="Supabase not configured")
            
        headers = {
            "apikey": supabase_anon_key,
            "Authorization": f"Bearer {supabase_anon_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "title": request.title,
            "content": request.content,
            "excerpt": request.excerpt,
            "author": request.author,
            "published_at": request.published_at or None
        }
        
        response = requests.patch(f"{supabase_url}/rest/v1/blog_posts?id=eq.{blog_id}", headers=headers, json=data)
        if response.status_code == 204:
            return {"success": True, "message": "Blog post updated successfully"}
        else:
            logger.error(f"Supabase error updating blog: {response.status_code} - {response.text}")
            raise HTTPException(status_code=500, detail="Failed to update blog post")
    except Exception as e:
        logger.error(f"Error updating blog: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update blog post: {str(e)}")

@app.delete("/api/admin/blogs/{blog_id}")
async def delete_blog(blog_id: int, credentials: HTTPAuthorizationCredentials = Depends(verify_admin_token)):
    """Delete a blog post"""
    try:
        supabase_url = os.getenv("VITE_SUPABASE_URL", "")
        supabase_anon_key = os.getenv("VITE_SUPABASE_ANON_KEY", "")
        
        if not supabase_url or not supabase_anon_key:
            raise HTTPException(status_code=400, detail="Supabase not configured")
            
        headers = {
            "apikey": supabase_anon_key,
            "Authorization": f"Bearer {supabase_anon_key}",
            "Content-Type": "application/json"
        }
        
        response = requests.delete(f"{supabase_url}/rest/v1/blog_posts?id=eq.{blog_id}", headers=headers)
        if response.status_code == 204:
            return {"success": True, "message": "Blog post deleted successfully"}
        else:
            logger.error(f"Supabase error deleting blog: {response.status_code} - {response.text}")
            raise HTTPException(status_code=500, detail="Failed to delete blog post")
    except Exception as e:
        logger.error(f"Error deleting blog: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete blog post: {str(e)}")

@app.get("/api/admin/resources")
async def get_admin_resources(credentials: HTTPAuthorizationCredentials = Depends(verify_admin_token)):
    """Get all resources for admin management"""
    try:
        supabase_url = os.getenv("VITE_SUPABASE_URL", "")
        supabase_anon_key = os.getenv("VITE_SUPABASE_ANON_KEY", "")
        
        if not supabase_url or not supabase_anon_key:
            return {"resources": []}
            
        headers = {
            "apikey": supabase_anon_key,
            "Authorization": f"Bearer {supabase_anon_key}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(f"{supabase_url}/rest/v1/resources?select=*&order=created_at.desc", headers=headers)
        if response.status_code == 200:
            return {"resources": response.json()}
        else:
            logger.error(f"Supabase error fetching resources: {response.status_code} - {response.text}")
            return {"resources": []}
    except Exception as e:
        logger.error(f"Error fetching resources: {str(e)}")
        return {"resources": []}

@app.post("/api/admin/resources")
async def create_resource(request: ResourceRequest, credentials: HTTPAuthorizationCredentials = Depends(verify_admin_token)):
    """Create a new resource"""
    try:
        supabase_url = os.getenv("VITE_SUPABASE_URL", "")
        supabase_anon_key = os.getenv("VITE_SUPABASE_ANON_KEY", "")
        
        if not supabase_url or not supabase_anon_key:
            raise HTTPException(status_code=400, detail="Supabase not configured")
            
        headers = {
            "apikey": supabase_anon_key,
            "Authorization": f"Bearer {supabase_anon_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "title": request.title,
            "description": request.description,
            "file_url": request.file_url,
            "category": request.category
        }
        
        response = requests.post(f"{supabase_url}/rest/v1/resources", headers=headers, json=data)
        if response.status_code == 201:
            return {"success": True, "message": "Resource created successfully"}
        else:
            logger.error(f"Supabase error creating resource: {response.status_code} - {response.text}")
            raise HTTPException(status_code=500, detail="Failed to create resource")
    except Exception as e:
        logger.error(f"Error creating resource: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create resource: {str(e)}")

@app.put("/api/admin/resources/{resource_id}")
async def update_resource(resource_id: int, request: ResourceRequest, credentials: HTTPAuthorizationCredentials = Depends(verify_admin_token)):
    """Update an existing resource"""
    try:
        supabase_url = os.getenv("VITE_SUPABASE_URL", "")
        supabase_anon_key = os.getenv("VITE_SUPABASE_ANON_KEY", "")
        
        if not supabase_url or not supabase_anon_key:
            raise HTTPException(status_code=400, detail="Supabase not configured")
            
        headers = {
            "apikey": supabase_anon_key,
            "Authorization": f"Bearer {supabase_anon_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "title": request.title,
            "description": request.description,
            "file_url": request.file_url,
            "category": request.category
        }
        
        response = requests.patch(f"{supabase_url}/rest/v1/resources?id=eq.{resource_id}", headers=headers, json=data)
        if response.status_code == 204:
            return {"success": True, "message": "Resource updated successfully"}
        else:
            logger.error(f"Supabase error updating resource: {response.status_code} - {response.text}")
            raise HTTPException(status_code=500, detail="Failed to update resource")
    except Exception as e:
        logger.error(f"Error updating resource: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update resource: {str(e)}")

@app.delete("/api/admin/resources/{resource_id}")
async def delete_resource(resource_id: int, credentials: HTTPAuthorizationCredentials = Depends(verify_admin_token)):
    """Delete a resource"""
    try:
        supabase_url = os.getenv("VITE_SUPABASE_URL", "")
        supabase_anon_key = os.getenv("VITE_SUPABASE_ANON_KEY", "")
        
        if not supabase_url or not supabase_anon_key:
            raise HTTPException(status_code=400, detail="Supabase not configured")
            
        headers = {
            "apikey": supabase_anon_key,
            "Authorization": f"Bearer {supabase_anon_key}",
            "Content-Type": "application/json"
        }
        
        response = requests.delete(f"{supabase_url}/rest/v1/resources?id=eq.{resource_id}", headers=headers)
        if response.status_code == 204:
            return {"success": True, "message": "Resource deleted successfully"}
        else:
            logger.error(f"Supabase error deleting resource: {response.status_code} - {response.text}")
            raise HTTPException(status_code=500, detail="Failed to delete resource")
    except Exception as e:
        logger.error(f"Error deleting resource: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete resource: {str(e)}")
