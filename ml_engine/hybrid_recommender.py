import pickle
import numpy as np
import os
import sys

# Setup paths
current_dir = os.path.dirname(os.path.abspath(__file__))
output_path = os.path.join(current_dir, "../backend/model.pkl") 

# ✅ IMPORT FIX: Yeh file 'build_hybrid.py' se class legi
try:
    from build_hybrid import HybridRecommender
except ImportError:
    sys.path.append(current_dir)
    from build_hybrid import HybridRecommender

def build_hybrid():
    print("⏳ Loading artifacts...")
    
    # 1. Load CF Model
    try:
        cf_path = os.path.join(current_dir, "cf_model.pkl")
        if not os.path.exists(cf_path):
            print("❌ CF Model missing.")
            return
        with open(cf_path, "rb") as f:
            cf_model, user_map, item_map = pickle.load(f)
    except Exception as e:
        print(f"❌ Error CF: {e}")
        return

    # 2. Load Embeddings
    try:
        text_path = os.path.join(current_dir, "text_embeddings.npy")
        image_path = os.path.join(current_dir, "image_embeddings.npy")
        text_embeddings = np.load(text_path, allow_pickle=True).item()
        image_embeddings = np.load(image_path, allow_pickle=True).item()
    except Exception as e:
        print(f"❌ Error Embeddings: {e}")
        return

    # 3. Load Popularity
    popularity_scores = {}
    pop_path = os.path.join(current_dir, "popularity_scores.pkl")
    if os.path.exists(pop_path):
        with open(pop_path, "rb") as f:
            popularity_scores = pickle.load(f)

    # 4. Initialize
    hybrid = HybridRecommender(
        cf_model, user_map, item_map, text_embeddings, image_embeddings, popularity_scores
    )

    # 5. Save
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "wb") as f:
        pickle.dump(hybrid, f)
    print(f"🚀 Hybrid model saved to: {output_path}")

if __name__ == "__main__":
    build_hybrid()