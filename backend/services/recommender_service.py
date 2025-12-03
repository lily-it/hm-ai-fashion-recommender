import sys
import os
import pickle
import random
from typing import List, Optional
from models.request_models import Product
from utils.logger import setup_logger

# Fix imports to allow loading the pickled object class
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

logger = setup_logger(__name__)

# --- FULL HIGH-QUALITY PRODUCT DATABASE ---
MOCK_PRODUCTS_DB = [
    # DENIM
    Product(article_id="010", name="Slim Fit Denim Jeans", price=4999, category="Denim", image_url="https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=1000&auto=format&fit=crop", score=0.98),
    Product(article_id="016", name="Vintage Wash Straight Jeans", price=5499, category="Denim", image_url="https://images.unsplash.com/photo-1582552938357-32b906df40cb?q=80&w=1000&auto=format&fit=crop", score=0.85),
    
    # TOPS
    Product(article_id="011", name="Classic White Tee", price=1499, category="Tops", image_url="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop", score=0.95),
    Product(article_id="017", name="Striped Cotton Polo", price=2499, category="Tops", image_url="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop", score=0.82),
    Product(article_id="018", name="Silk Blouse", price=3999, category="Tops", image_url="https://images.unsplash.com/photo-1564257631407-4deb1f99d992?q=80&w=1000&auto=format&fit=crop", score=0.79),

    # HOODIES
    # FIX: Updated with working Hoodie image
    Product(article_id="012", name="Urban Oversized Hoodie", price=3499, category="Hoodies", image_url="https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1000&auto=format&fit=crop", score=0.92),
    Product(article_id="019", name="Heavyweight Fleece Hoodie", price=4299, category="Hoodies", image_url="https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?q=80&w=1000&auto=format&fit=crop", score=0.88),

    # SHIRTS
    Product(article_id="013", name="Summer Resort Shirt", price=2499, category="Shirts", image_url="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop", score=0.88),
    Product(article_id="020", name="Oxford Button-Down", price=2999, category="Shirts", image_url="https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop", score=0.84),

    # TROUSERS
    Product(article_id="014", name="Tailored Linen Trousers", price=3999, category="Trousers", image_url="https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1000&auto=format&fit=crop", score=0.85),
    # FIX: Updated with working Cargo Pants image
    Product(article_id="021", name="Cargo Utility Pants", price=3499, category="Trousers", image_url="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000&auto=format&fit=crop", score=0.81),

    # DRESSES
    Product(article_id="015", name="Elegant Evening Dress", price=5999, category="Dresses", image_url="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop", score=0.82),
    Product(article_id="022", name="Floral Summer Dress", price=2999, category="Dresses", image_url="https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop", score=0.86),

    # JACKETS
    # FIX: Updated with working Leather Jacket image
    Product(article_id="023", name="Leather Biker Jacket", price=8999, category="Jackets", image_url="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1000&auto=format&fit=crop", score=0.91),
    Product(article_id="024", name="Classic Beige Trench", price=7499, category="Jackets", image_url="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop", score=0.89),
    # FIX: Updated with working Puffer Jacket image
    Product(article_id="025", name="Puffer Jacket", price=5499, category="Jackets", image_url="https://images.unsplash.com/photo-1617137968427-b5742727b310?q=80&w=1000&auto=format&fit=crop", score=0.83),

    # SHOES
    Product(article_id="026", name="Minimalist White Sneakers", price=4499, category="Shoes", image_url="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop", score=0.87),
    Product(article_id="027", name="Chelsea Boots", price=5999, category="Shoes", image_url="https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop", score=0.84),

    # ACCESSORIES
    Product(article_id="028", name="Leather Crossbody Bag", price=3499, category="Accessories", image_url="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop", score=0.80),
    Product(article_id="029", name="Classic Wayfarer Sunglasses", price=1299, category="Accessories", image_url="https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop", score=0.78),
]

# Load the trained model
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'model.pkl')
try:
    with open(MODEL_PATH, 'rb') as f:
        loaded_model = pickle.load(f)
    logger.info("✅ ML Model loaded successfully")
except Exception as e:
    # logger.warning(f"❌ Failed to load model: {e}") 
    loaded_model = None

class RecommenderService:
    def get_recommendations(self, customer_id: str) -> List[Product]:
        if not loaded_model:
            return MOCK_PRODUCTS_DB[:4]

        try:
            raw_recs = loaded_model.get_recommendations(int(customer_id) if customer_id.isdigit() else 0)
            enriched_recs = []
            for rec in raw_recs:
                product = self.get_product_by_id(rec['article_id'])
                if product:
                    product.score = rec['score']
                    enriched_recs.append(product)
            
            return enriched_recs if enriched_recs else MOCK_PRODUCTS_DB[:4]
            
        except Exception as e:
            logger.error(f"Prediction error: {e}")
            return MOCK_PRODUCTS_DB[:4]

    def get_trending(self) -> List[Product]:
        trending = MOCK_PRODUCTS_DB.copy()
        random.shuffle(trending)
        return trending[:8]

    def get_all_products(
        self, 
        category: Optional[str] = None, 
        search: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None
    ) -> List[Product]:
        
        filtered_products = MOCK_PRODUCTS_DB.copy()

        if category:
            filtered_products = [p for p in filtered_products if p.category.lower() == category.lower()]

        if search:
            search_term = search.lower()
            filtered_products = [p for p in filtered_products if search_term in p.name.lower()]

        if min_price is not None:
            filtered_products = [p for p in filtered_products if p.price >= min_price]

        if max_price is not None:
            filtered_products = [p for p in filtered_products if p.price <= max_price]

        return filtered_products
    
    def get_product_by_id(self, article_id: str) -> Optional[Product]:
        for item in MOCK_PRODUCTS_DB:
            if item.article_id == article_id:
                return item.copy()
        return None
    
    def get_similar_items(self, article_id: str) -> List[Product]:
        target = self.get_product_by_id(article_id)
        if not target:
            return MOCK_PRODUCTS_DB[:4]
            
        similar = [p for p in MOCK_PRODUCTS_DB if p.category == target.category and p.article_id != article_id]
        return similar[:4] if similar else MOCK_PRODUCTS_DB[:4]