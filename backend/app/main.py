from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from dotenv import load_dotenv
from typing import List, Dict, Any, Optional

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

SHOPIFY_SHOP_URL = os.getenv("SHOPIFY_SHOP_URL", "demo-shop.myshopify.com")
SHOPIFY_ACCESS_TOKEN = os.getenv("SHOPIFY_ACCESS_TOKEN", "demo-token")
SHOPIFY_API_VERSION = os.getenv("SHOPIFY_API_VERSION", "2023-10")

def get_shopify_headers():
    return {
        "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json"
    }

def make_shopify_request(endpoint: str, method: str = "GET", data: Optional[Dict] = None):
    url = f"https://{SHOPIFY_SHOP_URL}/admin/api/{SHOPIFY_API_VERSION}/{endpoint}"
    headers = get_shopify_headers()
    
    try:
        if method == "GET":
            response = requests.get(url, headers=headers)
        elif method == "POST":
            response = requests.post(url, headers=headers, json=data)
        elif method == "PUT":
            response = requests.put(url, headers=headers, json=data)
        elif method == "DELETE":
            response = requests.delete(url, headers=headers)
        
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Shopify API error: {str(e)}")

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.get("/api/products")
async def get_products(limit: int = 50):
    """Get products from Shopify store"""
    try:
        data = make_shopify_request(f"products.json?limit={limit}")
        return {"products": data.get("products", [])}
    except Exception as e:
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
