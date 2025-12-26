import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# ✅ FIX: Import all route modules correctly
from routes import auth, recommend, wishlist 

app = FastAPI(
    title="H&M Fashion Recommender API",
    description="Personalized fashion recommendation system powered by machine learning",
    version="1.0.0",
    contact={
        "name": "Priyanshu (showlittlemercy)",
        "email": "showlittlemercy@gmail.com",
        "url": "https://github.com/showlittlemercy"
    }
)

# --- CONFIGURING STATIC FILES (IMAGES) ---
current_dir = os.path.dirname(os.path.abspath(__file__))
image_path = os.path.join(current_dir, '..', 'dataset', 'images')

if not os.path.exists(image_path):
    print(f"Image folder missing at {image_path}. Creating it now...")
    os.makedirs(image_path, exist_ok=True)

if os.path.isdir(image_path):
    app.mount("/images", StaticFiles(directory=image_path), name="images")
    print(f"Serving images from: {image_path}")
else:
    print(f"Error: {image_path} exists but is not a directory.")

# --- CORS (CRITICAL FOR FRONTEND) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Wildcard: Allows requests from ANY origin
    allow_credentials=True,
    allow_methods=["*"], # Allow all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"], # Allow all headers
)
# --- REGISTER ROUTES ---
# Now these will work because we imported the modules above
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(recommend.router, tags=["Recommendations"])
app.include_router(wishlist.router, tags=["Wishlist"])

@app.get("/")
def home():
    return {"message": "H&M Fashion Recommender API is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

    #python main.py ,.\venv\Scripts\activate