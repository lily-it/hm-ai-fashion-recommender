import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer

def generate_text_embeddings():
    df = pd.read_csv("dataset/preprocessed_data.csv")
    df_articles = df.drop_duplicates("article_id")[["article_id", "prod_name"]]

    model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

    print("🔤 Generating text embeddings...")
    embeddings = model.encode(df_articles["prod_name"].tolist(), show_progress_bar=True)

    mapping = dict(zip(df_articles["article_id"], embeddings))
    np.save("ml_engine/text_embeddings.npy", mapping)

    print("✅ Saved text_embeddings.npy")

if __name__ == "__main__":
    generate_text_embeddings()
