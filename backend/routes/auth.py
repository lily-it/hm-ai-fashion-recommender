# backend/routes/auth.py

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from utils.db import supabase
from utils.security import create_access_token
# Note: Hashing import hata diya hai taaki simple rahe

router = APIRouter()

# --- Request Model ---
class UserAuth(BaseModel):
    email: str
    password: str

# --- SIGNUP ROUTE ---
@router.post("/signup")
def signup(user: UserAuth):
    try:
        # Step 1: Supabase Auth Signup (Asli User creation)
        # Note: Supabase shayad min 6 chars maange, wo dashboard se change hota hai.
        result = supabase.auth.sign_up({"email": user.email, "password": user.password})

        if result.user:
            # Step 2: Manual entry in app_users table
            # FIX: Password ab seedha 'plain text' mein save ho raha hai.
            # Jo tum daloge, wahi DB mein dikhega.
            supabase.table("app_users").insert({
                "user_id": result.user.id, 
                "email": user.email,
                "password_hash": user.password  # <--- No Hashing, Raw Password
            }).execute()

        return {"status": "success", "message": "Check your email for verification link!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- LOGIN ROUTE ---
@router.post("/login")
def login(user: UserAuth):
    try:
        # Step 1: Supabase Auth Login
        result = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })

        if result.user is None or result.session is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # Step 2: Create JWT (Session Token)
        access_token = create_access_token(
            data={
                "sub": result.user.email,
                "user_id": result.user.id
            }
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": result.user.id,
            "email": result.user.email
        }

    except Exception as e:
        print("LOGIN ERROR:", e)
        raise HTTPException(status_code=401, detail="Invalid email or password")