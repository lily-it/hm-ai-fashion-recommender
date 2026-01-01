import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles 

# ✅ FIX: Import all route modules correctly
from routes import auth, recommend

app = FastAPI(
    title="H&M Fashion Recommender API",
    description="Personalized fashion recommendation system powered by machine learning",
    version="1.0.0",
    contact={
        "name": "Dixika (lily-it)",
        "email": "dixika2001@gmail.com",
        "url": "https://github.com/lily-it"
    }
)

# --- CONFIGURING STATIC FILES (IMAGES) ---
current_dir = os.path.dirname(os.path.abspath(__file__))
image_path = os.path.join(current_dir, '..', 'dataset', 'images')

if not os.path.exists(image_path):
    print(f"⚠️ Image folder missing at {image_path}. Creating it now...")
    os.makedirs(image_path, exist_ok=True)

if os.path.isdir(image_path):
    app.mount("/images", StaticFiles(directory=image_path), name="images")# it means whatever files are present in that directory will be accessible via /images route
    print(f"✅ Serving images from: {image_path}")
else:
    print(f"❌ Error: {image_path} exists but is not a directory.")

# --- CORS (CRITICAL FOR FRONTEND) ---it is like a visa officer for web applications
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

# --- REGISTER ROUTES ---
# Now these will work because we imported the modules above
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(recommend.router, tags=["Recommendations"])

@app.get("/") 
def home():
    return {"message": "H&M Fashion Recommender API is running!"}

if __name__ == "__main__":
    import uvicorn 
    uvicorn.run(app, host="0.0.0.0", port=8000) 
    # uvicorn.run to start the FastAPI server
    #python main.py ,.\venv\Scripts\activate
