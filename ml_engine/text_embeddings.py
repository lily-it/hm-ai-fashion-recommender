from sentence_transformers import SentenceTransformer
import numpy as np

class TextEmbedder:
    def __init__(self, model_name='sentence-transformers/all-MiniLM-L6-v2'):
        self.model = SentenceTransformer(model_name)

    def generate_embeddings(self, texts):
        return self.model.encode(texts, convert_to_tensor=True)

    def cosine_similarity(self, embedding1, embedding2):
        return np.dot(embedding1, embedding2) / (np.linalg.norm(embedding1) * np.linalg.norm(embedding2))

    def embed_articles(self, articles):
        names = articles["prod_name"].tolist()
        embeddings = self.model.encode(names, show_progress_bar=True)
        return embeddings

# Example usage:
# embedder = TextEmbedder()
# product_names = ["Cotton Oversized Jacket", "Denim Jeans"]
# embeddings = embedder.generate_embeddings(product_names)
# similarity_score = embedder.cosine_similarity(embeddings[0], embeddings[1])