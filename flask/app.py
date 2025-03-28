from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from transformers import BertTokenizer
from flask_cors import CORS

app = Flask(_name_)
CORS(app)  # Enable CORS to handle cross-origin requests

# Load tokenizer
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

MAX_LEN = 4096  # Ensure this matches training

# Preload models
models = {
    "model_2": tf.keras.models.load_model("./sqliv2.h5", compile=False),
    "model_1": tf.keras.models.load_model("./sqli.h5", compile=False)
}


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    query = data.get("query")
    model_choice = data.get("model")
    
    if not query:
        return jsonify({"error": "No query provided"}), 400
    
    if model_choice not in models:
        return jsonify({"error": "Invalid model choice. Available options: model_1, model_2"}), 400
    
    model = models[model_choice]
    
    # Tokenize query
    tokens = tokenizer(
        query,
        padding="max_length",
        truncation=True,
        max_length=MAX_LEN,
        return_tensors="np"
    )
    input_ids = tokens["input_ids"].reshape(-1, 64, 64, 1)  # Ensure consistency with training
    
    # Make prediction
    prediction = model.predict(input_ids)[0][0]  # Get single prediction value
    
    # Classify as "safe" or "malicious"
    result = "safe" if prediction < 0.5 else "malicious"
    
    return jsonify({"prediction": float(prediction), "classification": result})

if _name_ == "_main_":
    app.run(port=5000, debug=True)