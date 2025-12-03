from fastapi import APIRouter, HTTPException
from services.recommender_service import RecommenderService

router = APIRouter()
service = RecommenderService()

# ---------------------------------------
# Personalized Recommendations
# ---------------------------------------
@router.get("/recommendations/{customer_id}")
def get_recommendations(customer_id: str):
    try:
        return service.get_recommendations(customer_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------------------------------------
# FIXED: Trending Items
# Matching service.get_trending()
# ---------------------------------------
@router.get("/trending")
def get_trending():
    try:
        return service.get_trending()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------------------------------------
# Get a single product by ID
# ---------------------------------------
@router.get("/products/{article_id}")
def get_product_by_id(article_id: str):
    product = service.get_product_by_id(article_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# ---------------------------------------
# Search & Filter products
# ---------------------------------------
@router.get("/products")
def get_products(
    search: str = None,
    category: str = None,
    min_price: float = None,
    max_price: float = None,
):
    return service.get_all_products(
        category=category,
        search=search,
        min_price=min_price,
        max_price=max_price,
    )

# ---------------------------------------
# Similar Items
# ---------------------------------------
@router.get("/similar-items/{article_id}")
def get_similar_items(article_id: str):
    try:
        return service.get_similar_items(article_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------------------------------------
# Track product view
# ---------------------------------------
@router.post("/track-view/{article_id}")
def track_view(article_id: str):
    print(f"📌 Tracked product view: {article_id}")
    return {"status": "success", "article_id": article_id}

# ---------------------------------------
# Track generic analytics
# ---------------------------------------
@router.post("/track")
def track_action(data: dict):
    print(f"📌 Tracking data: {data}")
    return {"status": "success", "received": data}
