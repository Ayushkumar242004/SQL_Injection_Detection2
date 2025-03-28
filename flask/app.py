from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import tensorflow as tf
from transformers import BertTokenizer

app = Flask(__name__)
CORS(app)

# Load models
# model_sqliv = tf.keras.models.load_model("sqliv2.h5")
# model_sqli = tf.keras.models.load_model("sqli.h5")

tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

MAX_LEN = 512  # Adjusted for tokenization
THRESHOLD = 0.5  # Classification threshold

def preprocess_query(query):
    tokens = tokenizer.encode(query, truncation=True, padding="max_length", max_length=MAX_LEN)
    return np.array(tokens).reshape(1, -1)

def predict_query(query, model_choice="sqliv"):
    try:
        model = model_sqliv if model_choice == "sqliv" else model_sqli
        processed = preprocess_query(query)
        prediction = model.predict(processed)[0][0]
        return {"query": query, "isMalicious": prediction > THRESHOLD, "score": float(prediction)}
    except Exception as e:
        return {"query": query, "error": str(e)}

@app.route("/predict", methods=["POST"])
def validate_query():
    """Validates a single SQL query."""
    data = request.json
    query = data.get("query", "")
    model_choice = data.get("model", "sqliv")

    if not query:
        return jsonify({"error": "Query is empty"}), 400

    result = predict_query(query, model_choice)
    return jsonify(result)

@app.route("/predict_batch", methods=["POST"])
def validate_csv():
    """Validates a batch of queries from an uploaded CSV file."""
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    try:
        df = pd.read_csv(file)
        if "query" not in df.columns:
            return jsonify({"error": "CSV must contain a 'query' column"}), 400

        results = [predict_query(q) for q in df["query"].dropna()]
        return jsonify({"results": results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
