from pydantic import BaseModel
from typing import Optional

class Product(BaseModel):
    article_id: str
    name: str
    price: float
    category: str
    image_url: str
    score: Optional[float] = None