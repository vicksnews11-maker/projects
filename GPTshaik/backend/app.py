from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": "gptshaik-backend"})

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '')
        if not user_message:
            return jsonify({"error": "Message is required"}), 400
        demo_response = "Hello! I am GPTshaik in DEMO MODE. You said: " + user_message
        if "kubernetes" in user_message.lower():
            demo_response = "Kubernetes is a container orchestration platform for automating deployment and scaling."
        elif "docker" in user_message.lower():
            demo_response = "Docker is a platform for developing and running applications in containers."
        elif "hello" in user_message.lower():
            demo_response = "Hello! I am GPTshaik, your AI assistant in demo mode!"
        return jsonify({"response": demo_response, "status": "success"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/models', methods=['GET'])
def get_models():
    return jsonify({"models": ["demo"], "default": "demo"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)