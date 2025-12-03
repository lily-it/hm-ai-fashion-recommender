from fastapi import APIRouter
from services.recommender_service import RecommenderService

router = APIRouter()
service = RecommenderService()

# In-memory wishlist storage (safe & non-intrusive)
wishlist_db = {}

@router.post("/wishlist/add/{customer_id}/{article_id}")
def add_to_wishlist(customer_id: str, article_id: str):
    wishlist_db.setdefault(customer_id, set()).add(article_id)
    return {"status": "success", "message": "Added to wishlist"}

@router.get("/wishlist/{customer_id}")
def get_wishlist(customer_id: str):
    items = wishlist_db.get(customer_id, [])
    return [service.get_product_by_id(id) for id in items]
