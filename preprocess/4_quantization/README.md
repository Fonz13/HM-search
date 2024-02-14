## How to get Quantized Models ready for client-side inference using transformer.js

Method is taken from https://youtu.be/8S6xoadcyW4?t=986

### 1: Get the onnx files

Run the cells in this colab to get the onnx files:
https://colab.research.google.com/drive/1LOYJYLjTFk4-vGtgwjg54kaDN18dP2md?usp=sharing

### 2: Get the working config files

For sume reason, the config files generated from the scripts does not work correctly.

To get working configs, download the original model configs from:
https://huggingface.co/Xenova/clip-vit-base-patch32/tree/main
Fashion-clip is a finetuned version of clip-vit-base 32, so should be fine.

Clone repo using:

```
git lfs install
git clone https://huggingface.co/Xenova/clip-vit-base-patch32
```

### 3: Switch the onnx files

In the onnx folder, remove the VIT-b-32 onnx files and paste the ones generated from the colab

### 4: Upload the files to HF

as seen in the video https://youtu.be/8S6xoadcyW4?t=1037
