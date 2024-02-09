import fastapi
from pydantic import BaseModel
import pandas as pd
import faiss
from typing import List, Optional
from routers.models import SearchQuery, SearchResultItem, SearchResults, FilterQuery
import numpy as np
import gdown

# Set up router
router = fastapi.APIRouter()

# Load data
df = pd.read_csv("data/H&M_items.csv", dtype=str)

try:
    index = faiss.read_index("data/index.faiss")
except:
    gdown.download(
        id="1irCcxJdPDwUaxOZGv_QTbMaXWZydXSzA",
        output="data/index.faiss",
    )
    index = faiss.read_index("data/index.faiss")


import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
logger.addHandler(logging.StreamHandler())

# Global variables
filters = ["index_group_name", "product_group_name", "product_type_name", "color"]


def filter_hepler(filter_query) -> str:
    """
    Helper function to create the query string for filtering the data

    params:
        filter_query: FilterQuery or SearchQuery obj
    returns:
        str - the query string
    """

    query_string = " and ".join(
        [
            f"{filter}=='{getattr(filter_query,filter)}'"
            for filter in filters
            if getattr(filter_query, filter) != ""
        ]
    )
    return query_string


@router.post("/filter")
def filter(filter_query: FilterQuery):  # -> SearchResults:
    logger.info("ghjk")
    """
    Filter the data based on the filter query

    params:
        filter_query: FilterQuery - the filter query
    returns:
        SearchResults - the filtered results, as a SearchResults object of 36 items

    """
    index_range = (
        filter_query.page * 36,
        (filter_query.page + 1) * 36,
    )  # 36 items per page

    # logger.info(getattr(filter_query, "index_group_name"))

    query_string = filter_hepler(filter_query)

    if query_string != "":
        # if there is a filter
        result = df.query(query_string).iloc[index_range[0] : index_range[1]]
    else:
        # if there is no filter
        result = df.iloc[index_range[0] : index_range[1]]

    filter_result = SearchResults(
        items=result[["href", "image_src", "prod_name", "article_id"]].to_dict(
            orient="records"
        )
    )
    return filter_result


@router.post("/search/")
def search(search_query: SearchQuery) -> SearchResults:

    # TODO: if image and text query is None, do a filterQuery insted
    if search_query.image_query == "" and search_query.text_query == "":
        filter_query = FilterQuery(
            index_group_name=search_query.index_group_name,
            product_group_name=search_query.product_group_name,
            product_type_name=search_query.product_type_name,
            color=search_query.color,
            page=0,
        )
        return filter(filter_query)

    # Filter the data based on the search query
    query_string = filter_hepler(search_query)
    if query_string != "":
        # if there is a filter, get the indexes of the filtered data
        filtered_indexes = list(df.query(query_string).index)  # get the indexes

        params = faiss.SearchParameters(sel=faiss.IDSelectorBatch(filtered_indexes))
    else:
        params = None  # no filter

    embeddings = []
    # TODO: if text_query is not None, encode the text and append to the embeddings list

    # If there is an image query, append the image embeddings to the embeddings list
    if len(search_query.image_query) > 0:
        selected_indexes = list(
            df[df.article_id.isin(search_query.image_query)].index
        )  # a list of image indexes
        embeddings.extend(
            index.reconstruct_batch(selected_indexes)
        )  # get the embeddings of the selected indexes, append

    # Perform aggregation method if there are more than one embeddings
    if len(embeddings) > 1:
        if (
            search_query.aggregation_strategy == "mean" or True
        ):  ## currently always do mean
            # if the aggregation strategy is mean
            query_embedding = np.mean(embeddings, axis=0).reshape((1, 512))

            # normalize the query embedding
            query_embedding = query_embedding / np.linalg.norm(
                query_embedding, ord=2, axis=-1, keepdims=True
            )

    # Perform a search
    k = 36  # number of nearest neighbors
    # either IDSelectorBatch, or IDSelectorArray for filtered search
    # D = distances, I = indexes
    _, I = index.search(query_embedding.astype("float32"), k, params=params)

    # get the results, I is a list containing a list of each items nearest neigbors.
    # We are only searching for one item, so we get the first list
    result = df.iloc[I[0]]

    search_result = SearchResults(
        items=result[["href", "image_src", "prod_name", "article_id"]].to_dict(
            orient="records"
        )
    )

    return search_result
