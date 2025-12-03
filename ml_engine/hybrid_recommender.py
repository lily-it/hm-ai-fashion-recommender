from typing import List, Dict, Any
# ... rest of class ...

class HybridRecommender:
    def __init__(self, cf_model, text_model, image_model):
        self.cf_model = cf_model
        self.text_model = text_model
        self.image_model = image_model

    def get_recommendations(self, user_id: int, top_n: int = 10) -> List[Dict]:
        cf_scores = self.cf_model.predict(user_id)
        text_scores = self.text_model.predict(user_id)
        image_scores = self.image_model.predict(user_id)

        final_scores = self.combine_scores(cf_scores, text_scores, image_scores)

        top_recommendations = sorted(final_scores.items(), key=lambda x: x[1], reverse=True)[:top_n]
        return [{"article_id": article_id, "score": score} for article_id, score in top_recommendations]

    def combine_scores(self, cf_scores: Dict[int, float], text_scores: Dict[int, float], image_scores: Dict[int, float]) -> Dict[int, float]:
        combined_scores = {}
        for article_id in set(cf_scores.keys()).union(text_scores.keys()).union(image_scores.keys()):
            cf_score = cf_scores.get(article_id, 0)
            text_score = text_scores.get(article_id, 0)
            image_score = image_scores.get(article_id, 0)

            combined_scores[article_id] = (0.5 * cf_score) + (0.3 * text_score) + (0.2 * image_score)

        return combined_scores