import sys
import os
import pickle
import random
from typing import List, Optional
from models.request_models import Product
from utils.logger import setup_logger
from utils.db import supabase

logger = setup_logger(__name__)

# --- PATH FIX ---
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../'))
sys.path.append(os.path.join(root_dir, 'ml_engine')) 
MODEL_PATH = os.path.join(root_dir, 'ml_engine', 'model.pkl')


# --- FETCH PRODUCTS FROM SUPABASE ---
def load_products_from_supabase():
    """Fetch all products from Supabase database"""
    try:
        response = supabase.table("products").select("*").execute()
        products = []
        
        for row in response.data:
            try:
                product = Product(
                    article_id=str(row.get('article_id', '')),
                    name=row.get('name', 'Unknown Product'),
                    price=float(row.get('price', 0)),
                    category=row.get('category', 'Uncategorized'),
                    image_url=row.get('image_url', ''),
                    description=row.get('description', ''),
                    score=float(row.get('score', 0.5))
                )
                products.append(product)
            except Exception as e:
                logger.warning(f"Could not parse product row: {row}. Error: {e}")
                continue
        
        logger.info(f"✅ Loaded {len(products)} products from Supabase")
        return products
    except Exception as e:
        logger.warning(f"❌ Could not fetch products from Supabase: {e}. Using fallback products.")
        return None



# --- FALLBACK PRODUCTS (Used if Supabase is unavailable) ---
FALLBACK_PRODUCTS_DB = [
    # --- JACKETS ---
    Product(article_id="1", name="Cotton Oversized Jacket", price=2499, category="Jackets",
            image_url="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop", score=0.95),
    Product(article_id="15", name="Vintage Denim Jacket", price=3499, category="Jackets",
            image_url="https://images.unsplash.com/photo-1523205565295-f8e91625443b?q=80&w=1000&auto=format&fit=crop", score=0.92),
    Product(article_id="21", name="Puffer Vest", price=2999, category="Jackets",
        image_url="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop", score=0.88),
    Product(article_id="25", name="Formal Slim Blazer", price=5999, category="Jackets",
            image_url="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop", score=0.85),
    Product(article_id="40", name="Bomber Jacket", price=3299, category="Jackets",
            image_url="https://images.unsplash.com/photo-1559551409-dadc959f76b8?q=80&w=1000&auto=format&fit=crop", score=0.89),
    # --- T-SHIRTS ---
    Product(article_id="2", name="Classic White T-Shirt", price=999, category="T-Shirts",
            image_url="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop", score=0.91),
    Product(article_id="16", name="Silk Evening Blouse", price=4499, category="Tops",
            image_url="https://images.unsplash.com/photo-1564257631407-4deb1f99d992?q=80&w=1000&auto=format&fit=crop", score=0.87),
    Product(article_id="26", name="Cotton Polo Shirt", price=1499, category="T-Shirts",
            image_url="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop", score=0.84),
    # --- JEANS ---
    Product(article_id="3", name="Denim Jeans", price=1999, category="Jeans",
            image_url="https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=1000&auto=format&fit=crop", score=0.93),
    Product(article_id="33", name="Wide Leg Jeans", price=2299, category="Jeans",
            image_url="https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=1000&auto=format&fit=crop", score=0.86),
    # --- TROUSERS ---
    Product(article_id="12", name="High-Waist Trousers", price=2999, category="Trousers",
            image_url="https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1000&auto=format&fit=crop", score=0.88),
    Product(article_id="22", name="Utility Cargo Pants", price=2499, category="Trousers",
            image_url="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000&auto=format&fit=crop", score=0.82),
    # --- DRESSES ---
    Product(article_id="5", name="Floral Maxi Dress", price=3499, category="Dresses",
            image_url="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop", score=0.94),
    Product(article_id="29", name="Cocktail Party Dress", price=4999, category="Dresses",
        image_url="https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop", score=0.90),
    # --- SHOES ---
    Product(article_id="4", name="Sneakers", price=2999, category="Shoes",
            image_url="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop", score=0.91),
    Product(article_id="14", name="Performance Running Shoes", price=3999, category="Shoes",
            image_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop", score=0.89),
    Product(article_id="18", name="Faux Leather Ankle Boots", price=3499, category="Shoes",
            image_url="https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop", score=0.85),
    Product(article_id="23", name="Summer Beach Sandals", price=1499, category="Shoes",
            image_url="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop", score=0.80),
    Product(article_id="30", name="Slip-on Loafers", price=2499, category="Shoes",
            image_url="https://images.unsplash.com/photo-1614252369475-531eba835eb1?q=80&w=1000&auto=format&fit=crop", score=0.83),
    Product(article_id="39", name="Chelsea Boots", price=3999, category="Shoes",
            image_url="https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop", score=0.88),
    # --- ACCESSORIES ---
    Product(article_id="7", name="Wool Scarf", price=1499, category="Accessories",
            image_url="https://images.unsplash.com/photo-1457545195570-67f207084966?auto=format&fit=crop&w=1000&q=80&auto=format&fit=crop", score=0.79),
    Product(article_id="17", name="Aviator Sunglasses", price=1299, category="Accessories",
            image_url="https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop", score=0.81),
    Product(article_id="24", name="Knit Beanie", price=799, category="Accessories",
            image_url="https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=1000&auto=format&fit=crop", score=0.75),
    Product(article_id="28", name="Genuine Leather Belt", price=999, category="Accessories",
            image_url="https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1000&auto=format&fit=crop", score=0.78),
    Product(article_id="35", name="Bucket Hat", price=899, category="Accessories",
            image_url="https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?q=80&w=1000&auto=format&fit=crop", score=0.76),
    Product(article_id="36", name="Leather Wallet", price=1499, category="Accessories",
            image_url="https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop", score=0.82),
]

# --- INITIALIZE PRODUCTS ON STARTUP ---
# Try to load from Supabase, fall back to hardcoded list
PRODUCTS_DB = load_products_from_supabase() or FALLBACK_PRODUCTS_DB

try:
    with open(MODEL_PATH, 'rb') as f:
        loaded_model = pickle.load(f)
    logger.info(f"✅ ML Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    logger.warning(f"❌ Failed to load model: {e}") 
    loaded_model = None


class RecommenderService:
    # --- HELPER ---
    def get_product_by_id(self, article_id: str) -> Optional[Product]:
        for item in PRODUCTS_DB:
            if str(item.article_id) == str(article_id):
                try: return item.copy() 
                except: return item 
        return None

    # --- SECTION 1: VISUAL MATCH (Smart Fallback) ---
# --- SECTION 1: VISUAL MATCH (Strict Category Fallback) ---
    def get_visual_similar_products(self, article_id: str) -> List[Product]:
        enriched = []
        
        # 1. Try ML Model First (Visual Match)
        if loaded_model and hasattr(loaded_model, 'get_visual_matches'):
            try:
                raw_visual = loaded_model.get_visual_matches(article_id, top_n=6)
                for item in raw_visual:
                    p = self.get_product_by_id(str(item['article_id']))
                    if p:
                        p.score = item['score']
                        enriched.append(p)
            except Exception as e:
                logger.error(f"Visual match error: {e}")

        # 2. Strict Fallback: SAME CATEGORY ONLY (No Random Items)
        if len(enriched) < 4:

            target = self.get_product_by_id(article_id)
            if target:
                # Same category items lao, current product ko chodkar
                cat_items = self.get_popular_in_category(target.category, exclude_id=article_id)
                
                # Jo items already 'enriched' (ML) mein hain, unhe skip karo
                existing_ids = {str(p.article_id) for p in enriched}
                
                for p in cat_items:
                    if len(enriched) >= 4: break
                    if str(p.article_id) not in existing_ids:
                        enriched.append(p)
        
        return enriched[:4]

        # 2. FALLBACK: Same Category Items (Not Generic Trending)
        # Isse "Similar" section mein relevant items aayenge, na ki random
        target = self.get_product_by_id(article_id)
        if target:
            return self.get_popular_in_category(target.category, exclude_id=article_id)
        
        return self.get_trending()[:4]

    # --- SECTION 2: POPULAR ITEMS (Global) ---
    def get_ml_popular_items(self) -> List[Product]:
        # 1. Try ML Model
        if loaded_model and hasattr(loaded_model, 'get_popular_items'):
            try:
                raw_popular = loaded_model.get_popular_items(top_n=8)
                enriched = []
                for item in raw_popular:
                    p = self.get_product_by_id(str(item['article_id']))
                    if p:
                        p.score = item['score']
                        enriched.append(p)
                if enriched: return enriched
            except Exception as e:
                logger.error(f"Error in ML popularity: {e}")
        
        # 2. FALLBACK: Global Trending (Random Shuffle)
        return self.get_trending()

    # --- HELPERS ---
# --- HELPER: Popular in Category ---
    def get_popular_in_category(self, category: str, exclude_id: str = None) -> List[Product]:
        all_in_cat = [p for p in PRODUCTS_DB if p.category == category]
        
        # Current item ko list se hatao
        if exclude_id:
            all_in_cat = [p for p in all_in_cat if str(p.article_id) != str(exclude_id)]
            
        # Thoda shuffle karo taaki har baar same sequence na dikhe
        random.shuffle(all_in_cat)
        return sorted(all_in_cat, key=lambda x: x.score if x.score else 0, reverse=True)[:6]

    def get_trending(self) -> List[Product]:
        trending = PRODUCTS_DB.copy()
        random.shuffle(trending)
        return trending[:8]

    def get_all_products(self, category=None, search=None, min_price=None, max_price=None):
        filtered = PRODUCTS_DB.copy()
        if category:
            filtered = [p for p in filtered if p.category.lower() == category.lower()]
        if search:
            filtered = [p for p in filtered if search.lower() in p.name.lower()]
        if min_price:
            filtered = [p for p in filtered if p.price >= min_price]
        if max_price:
            filtered = [p for p in filtered if p.price <= max_price]
        return filtered

    # --- LEGACY SUPPORT ---
    def get_recommendations(self, customer_id: str):
        return self.get_trending()
    
    def get_similar_items(self, article_id: str):
        return self.get_visual_similar_products(article_id)

    # --- NEW: SPLIT LOGIC ---
# --- PAGE LOGIC: Split Recommendations ---
    def get_product_page_recommendations(self, article_id: str):
        """
        1. Similar = Visual Match OR Same Category
        2. Popular = Global Trending (ML or Random)
        """
        # 1. Visual / Category Match
        visual_matches = self.get_visual_similar_products(article_id)
        
        # 2. Global Popularity (Uses ML logic if available, else Trending)
        popular_matches = self.get_ml_popular_items()
            
        # Filter: Remove current product from popular list
        popular_matches = [p for p in popular_matches if str(p.article_id) != str(article_id)]
        
        # Filter: Remove items that are already shown in 'Similar Styles'
        visual_ids = {str(p.article_id) for p in visual_matches}
        popular_matches = [p for p in popular_matches if str(p.article_id) not in visual_ids]

        return {
            "similar": visual_matches[:4],
            "popular": popular_matches[:4]
        }
    #