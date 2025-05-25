import {
  env,
  AutoTokenizer,
  CLIPTextModelWithProjection,
} from "@xenova/transformers";
import api from "./api";

const EMBED_DIM = 512;

// Skip local model check
env.allowRemoteModels = false;
env.localModelPath = "/static/";

class ApplicationSingleton {
  static model_id = "fashion-clip"; //"ff13/fclip32";
  static tokenizer = null;
  static text_model = null;
  static metadata = null;
  static embeddings = null;

  static async getInstance(progress_callback = null) {
    // Load tokenizer and text model
    if (this.tokenizer === null) {
      this.tokenizer = AutoTokenizer.from_pretrained(this.model_id, {
        progress_callback,
        quantized: true,
      });
    }
    if (this.text_model === null) {
      this.text_model = CLIPTextModelWithProjection.from_pretrained(
        this.model_id,
        {
          progress_callback,
          quantized: true,
        }
      );
    }

    return Promise.all([this.tokenizer, this.text_model]);
  }
}

/**
 * Call the API to search for the embeddings
 * @param {embeddngs} embeddngs
 * @param {images} images
 * @returns {Promise} Promise object represents the items
 */
function callAPISearch(textEmbedding, imageIDs) {
  return api
    .post("/multi_modal_search/", {
      text_embedding: Array.from(textEmbedding.data),
      images: imageIDs,
    })
    .then((response) => {
      return response.data.items;
    })
    .catch((error) => {
      console.log(error);
    });
}

// Listen for messages from the main thread
self.addEventListener("message", async (event) => {
  // Get the tokenizer, model, metadata, and embeddings. When called for the first time,
  // this will load the files and cache them for future use.
  const [tokenizer, text_model] = await ApplicationSingleton.getInstance(
    self.postMessage
  );

  // Send the output back to the main thread
  self.postMessage({ status: "ready" });

  let text_embeds;
  if (event.data.text !== "") {
    // Run tokenization
    const text_inputs = tokenizer(event.data.text, {
      padding: true,
      truncation: true,
    });

    // Compute embeddings
    text_embeds = (await text_model(text_inputs)).text_embeds;
  } else {
    //if there is no text, send an empty array
    text_embeds = { data: [] };
  }

  // new
  const imageIDs = event.data.selectedImages;

  const returnedItems = await callAPISearch(text_embeds, imageIDs);

  // Send the output back to the main thread
  self.postMessage({
    status: "complete",
    output: returnedItems,
  });
});
