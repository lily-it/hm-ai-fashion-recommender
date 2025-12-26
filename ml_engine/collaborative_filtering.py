from implicit.als import AlternatingLeastSquares
import numpy as np
import pandas as pd

class CollaborativeFiltering:
    def __init__(self, user_item_matrix: pd.DataFrame):
        self.user_item_matrix = user_item_matrix
        self.model = AlternatingLeastSquares(factors=50, regularization=0.1, iterations=20)

    def train(self):
        # Convert the DataFrame to a sparse matrix
        sparse_matrix = self.user_item_matrix.values.astype(np.float32)
        self.model.fit(sparse_matrix)

    def recommend(self, user_id: int, num_recommendations: int = 10):
        user_index = self.user_item_matrix.index.get_loc(user_id)
        scores = self.model.recommend(user_index, sparse_matrix, N=num_recommendations)
        return scores

    def get_similar_items(self, item_id: int, num_similar: int = 10):
        item_index = self.user_item_matrix.columns.get_loc(item_id)
        scores = self.model.similar_items(item_index, N=num_similar)
        return scores