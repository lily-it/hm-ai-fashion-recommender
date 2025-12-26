import numpy as np
import pickle
import os
import sys
from sklearn.metrics.pairwise import cosine_similarity

# --- 1. HYBRID RECOMMENDER CLASS ---
class HybridRecommender:
    def __init__(self, cf_model, user_map, item_map, text_embeddings, image_embeddings, popularity_scores=None):
        self.cf_model = cf_model
        self.user_map = user_map
        self.item_map = item_map
        # Reverse map to find Article ID from Index
        self.id_to_article = {v: k for k, v in item_map.items()} 
        self.text_embeddings = text_embeddings
        self.image_embeddings = image_embeddings
        
        # Popularity scores
        self.popularity_scores = popularity_scores if popularity_scores else {}
        # Fallback: Top items from item_map if no popularity provided
        self.trending_items = list(self.item_map.keys())[:12] 

    def get_visual_matches(self, article_id, top_n=6):
        # ID Format check
        if article_id not in self.image_embeddings:
            try: article_id = str(article_id)
            except: pass
            
        if article_id not in self.image_embeddings:
            print(f"⚠️ Article {article_id} not found in image embeddings.")
            return []

        # Target image ka vector uthao
        target_vector = self.image_embeddings[article_id].reshape(1, -1)
        
        # Saare images ke saath similarity calculate karo
        candidate_ids = list(self.image_embeddings.keys())
        candidate_vectors = np.array([self.image_embeddings[k] for k in candidate_ids])
        
        similarities = cosine_similarity(target_vector, candidate_vectors)[0]
        
        # Top N indices (excluding itself)
        top_indices = np.argsort(similarities)[-top_n-1:-1][::-1]
        
        results = []
        for idx in top_indices:
            results.append({
                "article_id": str(candidate_ids[idx]),
                "score": float(similarities[idx])
            })
        return results

    def get_popular_items(self, top_n=10):
        if not self.popularity_scores:
            return [{"article_id": str(uid), "score": 1.0} for uid in self.trending_items[:top_n]]
        
        sorted_popular = sorted(self.popularity_scores.items(), key=lambda x: x[1], reverse=True)
        return [{"article_id": str(k), "score": float(v)} for k, v in sorted_popular[:top_n]]

    def get_recommendations(self, user_id, top_n=12):
        if user_id not in self.user_map:
            return self.get_popular_items(top_n)

        user_idx = self.user_map[user_id]
        user_vector = self.cf_model.user_factors[user_idx]
        item_factors = self.cf_model.item_factors
        
        scores = user_vector.dot(item_factors.T)
        top_indices = np.argpartition(scores, -top_n)[-top_n:]
        
        recommendations = []
        for idx in top_indices:
            article_id = self.id_to_article.get(idx)
            if article_id:
                recommendations.append({
                    "article_id": str(article_id), 
                    "score": float(scores[idx])
                })
        
        return sorted(recommendations, key=lambda x: x["score"], reverse=True)


# --- 2. BUILD FUNCTION (Jo Pipeline call karega) ---
def build_hybrid_model():
    print("⏳ Loading artifacts for Hybrid Model...")
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # ✅ FIX: YAHAN HAI CHANGE (Ab ye ml_engine folder mein save karega)
    output_path = os.path.join(current_dir, "model.pkl") 

    # 1. Load CF Model & Maps
    try:
        cf_path = os.path.join(current_dir, "cf_model.pkl")
        if not os.path.exists(cf_path):
            print(f"❌ Error: {cf_path} not found. Run build_cf_model.py first.")
            return

        with open(cf_path, "rb") as f:
            cf_model, user_map, item_map = pickle.load(f)
        print(f"✅ Loaded CF Model (Users: {len(user_map)}, Items: {len(item_map)})")
    except Exception as e:
        print(f"❌ Error loading CF Model: {e}")
        return

    # 2. Load Embeddings
    try:
        text_path = os.path.join(current_dir, "text_embeddings.npy")
        image_path = os.path.join(current_dir, "image_embeddings.npy")
        
        if not os.path.exists(text_path) or not os.path.exists(image_path):
            print("❌ Error: Embedding files missing. Run generation scripts first.")
            return

        text_embeddings = np.load(text_path, allow_pickle=True).item()
        image_embeddings = np.load(image_path, allow_pickle=True).item()
        print(f"✅ Loaded Embeddings")
    except Exception as e:
        print(f"❌ Error loading embeddings: {e}")
        return

    # 3. Load Popularity Scores
    popularity_scores = {}
    pop_path = os.path.join(current_dir, "popularity_scores.pkl")
    if os.path.exists(pop_path):
        try:
            with open(pop_path, "rb") as f:
                popularity_scores = pickle.load(f)
            print(f"✅ Loaded Popularity Scores ({len(popularity_scores)} items)")
        except Exception as e:
            print(f"⚠️ Warning: Could not load popularity scores: {e}")
    else:
        print("⚠️ Warning: popularity_scores.pkl not found. Using fallback.")

    # 4. Initialize & Save
    hybrid = HybridRecommender(
        cf_model=cf_model,
        user_map=user_map,
        item_map=item_map,
        text_embeddings=text_embeddings,
        image_embeddings=image_embeddings,
        popularity_scores=popularity_scores 
    )

    # Save directly to ml_engine folder
    try:
        with open(output_path, "wb") as f:
            pickle.dump(hybrid, f)
        print(f"🚀 Success! Hybrid model saved to: {output_path}")
    except Exception as e:
        print(f"❌ Error saving model: {e}")

# Direct run support
if __name__ == "__main__":
    build_hybrid_model()