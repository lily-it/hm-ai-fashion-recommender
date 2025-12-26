import pickle
import pandas as pd
import os
from scipy.sparse import csr_matrix
from implicit.als import AlternatingLeastSquares

def build(csv_path=None):
    # --- PATH SETUP (Robust) ---
    # Current script ki directory nikalo (ml_engine)
    current_dir = os.path.dirname(os.path.abspath(__file__))
    # Root directory (ek step peeche)
    base_dir = os.path.dirname(current_dir)
    
    # 1. Determine Input File Path
    if csv_path:
        file_path = csv_path
        print(f"📂 CF Model: Loading data from provided path: {file_path}")
    else:
        # Default: Try finding preprocessed_data.csv or transactions.csv in dataset folder
        path_preprocessed = os.path.join(base_dir, "dataset", "preprocessed_data.csv")
        path_transactions = os.path.join(base_dir, "dataset", "transactions.csv")
        
        if os.path.exists(path_preprocessed):
            file_path = path_preprocessed
        elif os.path.exists(path_transactions):
            print(f"⚠️ Preprocessed data not found. Falling back to {path_transactions}")
            file_path = path_transactions
        else:
            print(f"❌ Error: Neither 'preprocessed_data.csv' nor 'transactions.csv' found in {os.path.join(base_dir, 'dataset')}")
            return

    print(f"📂 CF Model: Loading data from {file_path}...")

    # 2. Load Data
    try:
        df = pd.read_csv(file_path, dtype={'article_id': str, 'customer_id': str})
    except Exception as e:
        print(f"❌ Error reading CSV: {e}")
        return

    # Ensure interaction column exists (if not provided, assume 1)
    if "interaction" not in df.columns:
        df["interaction"] = 1
    
    # 3. Map users & items to indices
    # We use 'category' types to create efficient mappings
    user_cat = df["customer_id"].astype("category")
    item_cat = df["article_id"].astype("category")

    user_codes = user_cat.cat.codes
    item_codes = item_cat.cat.codes

    # Create Dictionaries for mapping later (Index -> ID)
    user_map = dict(enumerate(user_cat.cat.categories))
    item_map = dict(enumerate(item_cat.cat.categories))

    # 4. Create Sparse Matrix
    matrix = csr_matrix(
        (df["interaction"], (user_codes, item_codes)),
        shape=(len(user_map), len(item_map))
    )

    # 5. Train Model
    print("🔧 Training ALS model...")
    # Factors aur iterations adjust kiye hain better speed/accuracy ke liye
    model = AlternatingLeastSquares(factors=64, regularization=0.1, iterations=20)
    model.fit(matrix)

    # 6. Save Model
    output_path = os.path.join(current_dir, "cf_model.pkl")

    with open(output_path, "wb") as f:
        pickle.dump((model, user_map, item_map), f)

    print(f"✅ CF model saved to {output_path}!")

if __name__ == "__main__":
    build()