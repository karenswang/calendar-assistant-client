from flask import Flask, request, jsonify
import assistant, explore
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/get_response', methods=['POST'])
def get_response():
    user_message = request.json.get('message')
    api_key = request.json.get('api_key')
    email = request.json.get('email')
    response = assistant.main(user_message, api_key, email)  # Call the main function from your assistant script
    return jsonify({'response': response})

@app.route('/get_explore_response', methods=['POST'])
def get_explore_response():
    user_message = request.json.get('message')
    api_key = request.json.get('api_key')
    email = request.json.get('email')
    response = explore.main(user_message, api_key, email)  # Call the main function from your assistant script
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True)