import pickle
import numpy as np
from hybrid_recommender import HybridRecommender

def build_hybrid():
    with open("ml_engine/cf_model.pkl", "rb") as f:
        cf_model, user_map, item_map = pickle.load(f)

    text_embeddings = np.load("ml_engine/text_embeddings.npy", allow_pickle=True).item()
    image_embeddings = np.load("ml_engine/image_embeddings.npy", allow_pickle=True).item()

    hybrid = HybridRecommender(cf_model, text_embeddings, image_embeddings)

    with open("backend/model.pkl", "wb") as f:
        pickle.dump(hybrid, f)

    print("🔥 Hybrid model saved to backend/model.pkl")

if __name__ == "__main__":
    build_hybrid()
