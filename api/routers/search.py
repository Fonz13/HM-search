import fastapi
from pydantic import BaseModel
import pandas as pd
import faiss
from typing import List
from routers.models import SearchResultsModel, searchModel
import numpy as np
import gdown
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
logger.addHandler(logging.StreamHandler())


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


@router.post("/multi_modal_search/")
def filter(search_query: searchModel) -> SearchResultsModel:
    images = search_query.images

    embeddings = []

    # If there is an image query, append the image embeddings to the embeddings list
    if len(images) > 0:

        # get index of each item
        # TODO OPTIMIZE: index can be sent in the request instead
        selected_indexes = [
            df[df.article_id.isin([image])].index[0] for image in images
        ]

        # a list of image indexes
        embeddings.extend(
            index.reconstruct_batch(selected_indexes)
        )  # get the embeddings of the selected indexes, append

    # If there is an text embedding, append it to the embeddings list
    if (
        len(search_query.text_embedding) > 0
    ):  # text query is an empty list if not present
        embeddings.extend(np.array(search_query.text_embedding).reshape(1, 512))

    # If an aggregation is needed, perform it
    if len(embeddings) > 1:
        # the aggregation strategy is mean
        embeddings = np.mean(embeddings, axis=0).reshape((1, 512))

        # normalize the query embedding
        embeddings = embeddings / np.linalg.norm(
            embeddings, ord=2, axis=-1, keepdims=True
        )

    # Perform a search
    k = 100  # number of nearest neighbors
    # either IDSelectorBatch, or IDSelectorArray for filtered search
    # D = distances, I = indexes
    _, I = index.search(np.array(embeddings).astype("float32"), k)

    result = df.iloc[I[0]]

    search_result = SearchResultsModel(
        items=result[["prod_name", "article_id"]].to_dict(orient="records")
    )

    return search_result
