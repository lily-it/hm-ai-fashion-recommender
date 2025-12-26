from fastapi import APIRouter, HTTPException, Query
from services.recommender_service import RecommenderService
from pydantic import BaseModel
from utils.db import supabase
from typing import Optional, List
from fastapi import UploadFile, File
import shutil

router = APIRouter()
service = RecommenderService()

# --- REQUEST MODELS ---
class InteractionRequest(BaseModel):
    user_id: str  # Must be a valid UUID string
    article_id: str
    interaction_type: str 

class BagRequest(BaseModel):
    user_email: str
    article_id: str
    size: str

# ---------------------------------------
# 1. PERMANENT WISHLIST (Database)
# ---------------------------------------
@router.post("/wishlist/add")
def add_to_wishlist(data: dict):
    try:
        # Frontend se data nikaalo
        email = data.get("user_email")
        article_id = data.get("article_id")

        print(f"📥 Wishlist Request -> Email: {email}, Article: {article_id}")

        if not email or not article_id:
            raise HTTPException(status_code=400, detail="user_email and article_id are required")

        # Database Check: Kya item pehle se hai?
        existing = supabase.table("wishlist").select("*").eq("user_email", email).eq("article_id", article_id).execute()
        
        if not existing.data:
            # Insert only if not exists
            supabase.table("wishlist").insert({
                "user_email": email,
                "article_id": article_id
            }).execute()
            print("✅ Item added to Supabase Wishlist")
        else:
            print("⚠️ Item already in Wishlist")

        return {"status": "success", "message": "Item saved permanently"}

    except Exception as e:
        print("❌ Wishlist Error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/wishlist/{user_email}")
def get_wishlist(user_email: str):
    try:
        print(f"🔍 Fetching Wishlist for: {user_email}")
        
        # 1. IDs fetch karo
        res = supabase.table("wishlist").select("article_id").eq("user_email", user_email).execute()
        item_ids = [row['article_id'] for row in res.data]
        
        # 2. Product details fetch karo
        products = []
        for pid in item_ids:
            p = service.get_product_by_id(pid)
            if p:
                products.append(p)
                
        return products
    except Exception as e:
        print("❌ Fetch Error:", e)
        return []

# ---------------------------------------
# 2. PERMANENT BAG (Database)
# ---------------------------------------
# backend/routes/recommend.py

# ... (add_to_bag function ke just baad yeh add karo) ...

@router.get("/bag/{user_email}")
def get_bag(user_email: str):
    try:
        print(f"🛍️ Fetching Bag for: {user_email}")
        
        # 1. Bag Items Fetch karo Supabase se
        res = supabase.table("bag").select("*").eq("user_email", user_email).execute()
        bag_items = res.data
        
        if not bag_items:
            return []

        # 2. Har item ki Product Details laao
        enriched_bag = []
        for item in bag_items:
            product = service.get_product_by_id(item['article_id'])
            if product:
                # Product data ke saath size bhi attach karo
                product_dict = product.dict() if hasattr(product, 'dict') else product.__dict__
                product_dict['selected_size'] = item['size'] 
                enriched_bag.append(product_dict)
                
        return enriched_bag
    except Exception as e:
        print("❌ Bag Fetch Error:", e)
        return []
# backend/routes/recommend.py
@router.post("/bag/add")
def add_to_bag(data: BagRequest):
    try:
        print(f"🛍️ Add to Bag Request -> User: {data.user_email}, Item: {data.article_id}, Size: {data.size}")
        
        # Check if item already exists in bag (to prevent duplicates if needed)
        # Note: Depending on your logic, you might want to increase quantity instead, 
        # but your current schema is simple, so we just check existence.
        existing = supabase.table("bag").select("*")\
            .eq("user_email", data.user_email)\
            .eq("article_id", data.article_id)\
            .eq("size", data.size)\
            .execute()

        if not existing.data:
            # Insert into Supabase
            supabase.table("bag").insert({
                "user_email": data.user_email,
                "article_id": data.article_id,
                "size": data.size
            }).execute()
            print("✅ Item saved to DB Bag")
            return {"status": "success"}
        else:
            print("⚠️ Item already in DB Bag")
            return {"status": "exists"}

    except Exception as e:
        print("❌ Add to Bag Error:", e)
        raise HTTPException(status_code=500, detail=str(e))
# ... (add_to_bag function ke just baad yeh add karo) ...

@router.get("/bag/{user_email}")
def get_bag(user_email: str):
    try:
        print(f"🛍️ Fetching Bag for: {user_email}")
        
        # 1. Bag Items Fetch karo Supabase se
        res = supabase.table("bag").select("*").eq("user_email", user_email).execute()
        bag_items = res.data
        
        if not bag_items:
            return []

        # 2. Har item ki Product Details laao (Product ID se lookup)
        enriched_bag = []
        for item in bag_items:
            product = service.get_product_by_id(item['article_id'])
            if product:
                # Product data ke saath size bhi attach karo
                product_dict = product.dict() if hasattr(product, 'dict') else product.__dict__
                product_dict['selected_size'] = item['size'] 
                enriched_bag.append(product_dict)
                
        return enriched_bag
    except Exception as e:
        print("❌ Bag Fetch Error:", e)
        return []
# ---------------------------------------
# 3. RECOMMENDATIONS & PRODUCTS (Fixing 404s)
# ---------------------------------------
@router.get("/recommendations/{customer_id}")
def get_recommendations(customer_id: str):
    try:
        return service.get_recommendations(customer_id)
    except Exception as e:
        return service.get_trending()

@router.get("/trending")
def get_trending():
    return service.get_trending()

@router.get("/products/{article_id}")
def get_product_by_id(article_id: str):
    p = service.get_product_by_id(article_id)
    if not p: raise HTTPException(404, "Product not found")
    return p

# --- MISSING ROUTE FIX (Search & Filter) ---
@router.get("/products")
def search_products(
    search: Optional[str] = None, 
    category: Optional[str] = None,
    min_price: Optional[float] = None,  # 👈 Added
    max_price: Optional[float] = None   # 👈 Added
):
    # Ab service ko price range bhi bhej rahe hain
    return service.get_all_products(
        category=category, 
        search=search, 
        min_price=min_price, 
        max_price=max_price
    )

# --- MISSING ROUTE FIX (Similar Items) ---
@router.get("/similar-items/{article_id}")
def get_similar_items(article_id: str):
    # Agar service mein logic nahi hai, toh trending return karo taaki crash na ho
    try:
        return service.get_recommendations(article_id) # Using simple logic for now
    except:
        return service.get_trending()[:4]

# ---------------------------------------
# 4. USER TRACKING (Fixing 500 Error)
# ---------------------------------------
@router.post("/track")
def track_interaction(interaction: InteractionRequest):
    try:
        # Schema Validation: user_id UUID hona chahiye
        print(f"Tracking: User={interaction.user_id}, Article={interaction.article_id}")
        
        supabase.table("user_interactions").insert({
            "user_id": interaction.user_id,
            "article_id": interaction.article_id,
            "interaction_type": interaction.interaction_type
        }).execute()
        return {"status": "success"}
    except Exception as e:
        print(f"❌ Tracking Error: {e}")
        # Error return mat karo taaki frontend na ruke, bas console mein print karo
        return {"status": "ignored", "error": str(e)}
    
    # ... (Keep your previous imports: APIRouter, supabase, etc.) ...

# Add this NEW route for finding similar items
@router.get("/similar-items/{article_id}")
def get_similar_items(article_id: str):
    try:
        print(f"🔎 Finding similar items for: {article_id}")
        items = service.get_similar_items(article_id)
        
        if not items:
            print("⚠️ No similar items found, returning trending.")
            return service.get_trending()[:4]
            
        return items
    except Exception as e:
        print(f"❌ Error in similar items: {e}")
        return service.get_trending()[:4]

# ... (Keep your other routes like /wishlist, /track, /products unchanged) ...
@router.post("/search-by-image")
def search_by_image(file: UploadFile = File(...)):
    try:
        print(f"📸 Received Image: {file.filename}")
        
        # NOTE: Real ML Project mein yahan hum image ko 
        # ML Model (ResNet) mein bhej kar embedding nikalte hain.
        # Abhi demo ke liye hum "Mock Search" kar rahe hain.
        
        # Just return some "Similar Looking" items from our DB
        return service.get_trending()[:6] 
        
    except Exception as e:
        print("Image Search Error:", e)
        return []
    # --- NEW ROUTE: Split Recommendations ---
@router.get("/recommendations/split/{article_id}")
def get_split_recommendations(article_id: str):
    try:
        print(f"🧠 Fetching Split Recommendations for: {article_id}")
        # Service function call
        data = service.get_product_page_recommendations(article_id)
        return data
    except Exception as e:
        print(f"❌ Error in split recommendations: {e}")
        # Fallback if error occurs
        trending = service.get_trending()[:4]
        return {"similar": trending, "popular": trending}