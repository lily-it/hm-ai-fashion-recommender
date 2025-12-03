import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routes import api_router   # ✅ FIX: import the combined router

app = FastAPI(title="H&M Fashion Recommender API")

# --- CONFIGURING STATIC FILES (IMAGES) ---
current_dir = os.path.dirname(os.path.abspath(__file__))
image_path = os.path.join(current_dir, '..', 'dataset', 'images')

if not os.path.exists(image_path):
    print(f"⚠️ Image folder missing at {image_path}. Creating it now...")
    os.makedirs(image_path, exist_ok=True)

if os.path.isdir(image_path):
    app.mount("/images", StaticFiles(directory=image_path), name="images")
    print(f"✅ Serving images from: {image_path}")
else:
    print(f"❌ Error: {image_path} exists but is not a directory.")

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- REGISTER ALL ROUTES (recommend + wishlist) ---
app.include_router(api_router)   # ✅ FIXED

@app.get("/")
def read_root():
    return {"message": "H&M Fashion Recommender API is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
