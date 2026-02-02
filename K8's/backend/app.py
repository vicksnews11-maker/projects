from flask import Flask, jsonify
import psycopg2
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

@app.route("/data")
def data():
    app.logger.info("Backend API called")
    return jsonify({"message": "Hello from Backend API"})

@app.route("/metrics")
def metrics():
    return "backend_requests_total 1"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
