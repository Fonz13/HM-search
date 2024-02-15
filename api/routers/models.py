from typing import List
from pydantic import BaseModel
from routers.literals import (
    product_type_name_literals,
    index_group_name_literals,
    product_group_name_literals,
    color_literals,
)


class SearchQuery(BaseModel):
    index_group_name: index_group_name_literals  # str
    product_group_name: product_group_name_literals  # str
    product_type_name: product_type_name_literals  # str
    color: color_literals  # str

    image_query: List[str]  # list of string article ids : article_id
    text_query: str  # text query
    aggregation_strategy: str  # aggregation strategy


class SearchResultItem(BaseModel):
    prod_name: str
    article_id: str


class SearchResultsModel(BaseModel):
    items: List[SearchResultItem]


class FilterQuery(BaseModel):
    index_group_name: index_group_name_literals  # str
    product_group_name: product_group_name_literals  # str
    product_type_name: product_type_name_literals  # str
    color: color_literals  # str
    page: int
