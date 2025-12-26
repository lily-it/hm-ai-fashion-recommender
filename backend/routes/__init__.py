# backend/routes/__init__.py

from fastapi import APIRouter
from .auth import router as auth_router         # Login/Signup yahan se
from .recommend import router as recommend_router # Wishlist/Bag/Recs yahan se

api_router = APIRouter()

# Routes register kar rahe hain
api_router.include_router(auth_router)
api_router.include_router(recommend_router)