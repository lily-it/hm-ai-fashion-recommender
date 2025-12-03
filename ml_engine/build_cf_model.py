import pickle
import pandas as pd
from scipy.sparse import csr_matrix
from implicit.als import AlternatingLeastSquares

def build_cf_model():
    df = pd.read_csv("dataset/preprocessed_data.csv")

    df["interaction"] = 1

    # Map users & items to indices
    user_codes = df["customer_id"].astype("category").cat.codes
    item_codes = df["article_id"].astype("category").cat.codes

    user_map = dict(enumerate(df["customer_id"].astype("category").cat.categories))
    item_map = dict(enumerate(df["article_id"].astype("category").cat.categories))

    matrix = csr_matrix(
        (df["interaction"], (user_codes, item_codes)),
        shape=(len(user_map), len(item_map))
    )

    print("🔧 Training ALS model...")
    model = AlternatingLeastSquares(factors=64, regularization=0.1, iterations=20)
    model.fit(matrix)

    with open("ml_engine/cf_model.pkl", "wb") as f:
        pickle.dump((model, user_map, item_map), f)

    print("✅ CF model saved!")

if __name__ == "__main__":
    build_cf_model()
