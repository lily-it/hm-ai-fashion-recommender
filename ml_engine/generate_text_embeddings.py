import pandas as pd
import numpy as np
import os
from sklearn.feature_extraction.text import TfidfVectorizer

def generate():
    # Setup Paths
    current_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = os.path.dirname(current_dir)
    
    # Data kahan se uthana hai (Articles/Products CSV)
    # Check karein articles.csv (H&M standard) ya preprocessed_data.csv
    path_articles = os.path.join(base_dir, "dataset", "articles.csv")
    path_preprocessed = os.path.join(base_dir, "dataset", "preprocessed_data.csv")
    
    if os.path.exists(path_articles):
        data_path = path_articles
    elif os.path.exists(path_preprocessed):
        data_path = path_preprocessed
    else:
        print("❌ Error: Koi data CSV nahi mili (articles.csv ya preprocessed_data.csv dhoondhi).")
        return

    output_path = os.path.join(current_dir, "text_embeddings.npy")

    print(f"📄 Text Embeddings: Loading data from {data_path}...")
    try:
        df = pd.read_csv(data_path, dtype={'article_id': str})
    except Exception as e:
        print(f"❌ Error reading CSV: {e}")
        return
    
    # Columns dhoondho (Standard H&M names vs Generic names)
    possible_cols = ['prod_name', 'product_type_name', 'detail_desc', 'name', 'description', 'category']
    text_cols = [c for c in possible_cols if c in df.columns]
    
    if not text_cols:
        print("⚠️ No text columns found. Skipping text embeddings.")
        # Dummy save taaki pipeline crash na ho
        np.save(output_path, {}) 
        return

    print(f"🔤 Vectorizing columns: {text_cols}...")
    # NaN values ko empty string banayein
    for col in text_cols:
        df[col] = df[col].fillna('')

    # Combine text
    df['combined_text'] = df[text_cols].apply(lambda x: ' '.join(x.values.astype(str)), axis=1)

    # TF-IDF Vectorizer (Simple NLP)
    tfidf = TfidfVectorizer(max_features=512, stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df['combined_text'])
    
    # Save as Dictionary {article_id: vector}
    print("💾 Saving text embeddings...")
    embeddings = {}
    ids = df['article_id'].values
    vectors = tfidf_matrix.toarray()
    
    for id, vec in zip(ids, vectors):
        embeddings[str(id)] = vec

    np.save(output_path, embeddings)
    print(f"✅ Saved {len(embeddings)} text embeddings to {output_path}")

if __name__ == "__main__":
    generate()