import os
import sys
import pandas as pd
import pickle

# Path setups
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(BASE_DIR, 'ml_engine'))

# --- IMPORT FIX ---
# Sahi file se 'build_hybrid' function import karein
from hybrid_recommender import build_hybrid 

def run_pipeline():
    print("🚀 Starting Visual + Popularity Hybrid Pipeline...")

    # 1. Sabse pehle Images aur Text ko vectors mein badlo
    # (Agar pehle se generated hain aur time bachana hai toh comment kar sakte ho)
    print("📸 Step 1: Generating Visual & Text Features...")
    os.system('python ml_engine/generate_image_embeddings.py')
    os.system('python ml_engine/generate_text_embeddings.py')

    # 2. Popularity Calculate Karo
    print("📈 Step 2: Calculating Product Popularity...")
    
    transactions_path = os.path.join(BASE_DIR, "dataset/transactions.csv")
    scores_path = os.path.join(BASE_DIR, 'ml_engine/popularity_scores.pkl')

    if os.path.exists(transactions_path):
        transactions = pd.read_csv(transactions_path)
        # Calculate frequency of each article_id
        popularity_map = transactions['article_id'].value_counts(normalize=True).to_dict()
        
        # Save scores for hybrid recommender to use
        with open(scores_path, 'wb') as f:
            pickle.dump(popularity_map, f)
        print(f"✅ Popularity calculated for {len(popularity_map)} items.")
    else:
        print("⚠️ Warning: transactions.csv not found. Skipping popularity calculation.")

    # 3. Hybrid Model Build Karo
    print("🧠 Step 3: Stitching Visual + Popularity Logic...")
    build_hybrid()  # ✅ Calling the function from hybrid_recommender.py

    print("✅ Done! Ab aapka system 'Smart' ho gaya hai.")

if __name__ == "__main__":
    run_pipeline()