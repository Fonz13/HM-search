import {
  env,
  AutoTokenizer,
  CLIPTextModelWithProjection,
  CLIPModel,
} from "@xenova/transformers";
import { getCachedFile, getCachedJSON } from "./utils.js";
import api from "./api";

const EMBED_DIM = 512;

// Skip local model check
env.allowLocalModels = false;
env.cacheDir = false;

class ApplicationSingleton {
  static model_id = "ff13/fclip32";
  static BASE_URL =
    "https://huggingface.co/datasets/Xenova/semantic-image-search-assets/resolve/main/";

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

function callAPI() {
  api
    .post("/test/", {
      test_str: "testing",
    })
    .then((response) => {
      if (response.statusText == "OK") {
        console.log(response.data);
      } else {
        console.log("error");
      }
    });
}

function EMBEDAPI(embeddngs) {
  return api
    .post("/post_embeds/", {
      embedds: Array.from(embeddngs.data),
    })
    .then((response) => {
      console.log(response.data.items);
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

  // Run tokenization
  const text_inputs = tokenizer(event.data.text, {
    padding: true,
    truncation: true,
  });

  //callAPI();

  // Compute embeddings
  const { text_embeds } = await text_model(text_inputs);

  const output_api = await EMBEDAPI(text_embeds);

  // Send the output back to the main thread
  self.postMessage({
    status: "complete",
    output: output_api,
  });
});
