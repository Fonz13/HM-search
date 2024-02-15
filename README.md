api
uvicorn main:app --host 0.0.0.0 --port 8080 --reload

frontend
npm run dev

Keywords: Client-side inference, Huggingface, H&M, Kaggle, Retrieval, Fashion-clip

# HM-search

Search H&M clothing items from over 100.000 examples. Using client-side inference and a faiss search index in the api, you can search using text, images or a combination of both.

![image](HM-search.png)

### Data

The data for this project is from the ["H&M Personalized Fashion Recommendations"](https://www.kaggle.com/competitions/h-and-m-personalized-fashion-recommendations/data) kaggle competition

### Embeddings info

#### Images

The backend faiss index contains image embeddings encoded by the [fashion-clip](https://huggingface.co/patrickjohncyh/fashion-clip) model which is the best of its kind in the fashion industry. A precomputed index will be downloaded when the api is first run, but if you want to create your own from the H&M kaggle dataset, download the kaggle dataset to the **preprocess** folder and run notebook 1-3.

#### Text

The text embeddings are encoded using a [quantized fashion-clip](https://huggingface.co/ff13/fashion-clip) to be able to run in the browser. If you want to quantize the model yourself, follow the instructions in [preprocess/4_quantization/README.md](preprocess/4_quantization/README.md)

### How the search works

When searching using **text**, the text is embedded in the browser and the embeddings are passed to the api where the 100 most similair items are retrieved.

When searching using **images**, the image article ids is passed api where the embeddings of those articles are reconstructed from the index and used to find the 100 most similair items.

When searching using many images or images and text, the embeddings are aggregated using the mean of each dimension and then normalized to create a new embedding representative of the query.

### Misc

The frontend is built using [transformers.js/semantic-image-search-client](https://github.com/xenova/transformers.js/tree/main/examples/semantic-image-search-client/) as a foundation.
