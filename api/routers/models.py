from typing import List
from pydantic import BaseModel


class searchModel(BaseModel):
    text_embedding: List[float]  # Optional[List[float]] = None
    images: List[str]


class SearchResultItem(BaseModel):
    prod_name: str
    article_id: str


class SearchResultsModel(BaseModel):
    items: List[SearchResultItem]
