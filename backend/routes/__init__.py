from fastapi import APIRouter
from .recommend import router as recommend_router
from .wishlist import router as wishlist_router   # MUST BE HERE

api_router = APIRouter()

api_router.include_router(recommend_router)
api_router.include_router(wishlist_router)        # MUST BE HERE
