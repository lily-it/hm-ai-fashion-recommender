import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
# ✅ FIX: Import the router directly from recommend (where we put all logic)
from routes.recommend import router as api_router 

app = FastAPI(title="H&M Fashion Recommender API")

# --- CONFIGURING STATIC FILES (IMAGES) ---
current_dir = os.path.dirname(os.path.abspath(__file__))
image_path = os.path.join(current_dir, '..', 'dataset', 'images')

if not os.path.exists(image_path):
    # Create it to prevent startup crash on Render (even if empty)
    print(f"⚠️ Image folder missing at {image_path}. Creating it now...")
    os.makedirs(image_path, exist_ok=True)

if os.path.isdir(image_path):
    app.mount("/images", StaticFiles(directory=image_path), name="images")
    print(f"✅ Serving images from: {image_path}")
else:
    print(f"❌ Error: {image_path} exists but is not a directory.")

# --- CORS (CRITICAL FOR DEPLOYMENT) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ✅ ALLOW ALL: Essential for Vercel to access Render
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- REGISTER ROUTES ---
app.include_router(api_router)

@app.get("/")
def read_root():
    return {"message": "H&M Fashion Recommender API is running!"}

if __name__ == "__main__":
    import uvicorn
    # Note: On Render, this block isn't used (it uses the Start Command), 
    # but it's good for local testing.
    uvicorn.run(app, host="0.0.0.0", port=8000)