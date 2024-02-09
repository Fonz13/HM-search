from typing import List, Optional, Literal
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

    image_query: Optional[List[str]]  # list of string article ids : article_id
    text_query: Optional[str]  # text query
    aggregation_strategy: Optional[str]  # aggregation strategy


class SearchResultItem(BaseModel):
    href: str
    image_src: str
    prod_name: str
    article_id: str


class SearchResults(BaseModel):
    items: List[SearchResultItem]


class FilterQuery(BaseModel):
    index_group_name: index_group_name_literals  # str
    product_group_name: product_group_name_literals  # str
    product_type_name: product_type_name_literals  # str
    color: color_literals  # str
    page: int
