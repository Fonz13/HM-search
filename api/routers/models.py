from typing import List
from pydantic import BaseModel


class searchModel(BaseModel):
    text_embedding: List[float]  # Optional[List[float]] = None
    images: List[str]  # list of image article_ids


class SearchResultItem(BaseModel):
    product_desc: str
    article_id: str
    product_url: str
    image_url: str


class SearchResultsModel(BaseModel):
    items: List[SearchResultItem]
