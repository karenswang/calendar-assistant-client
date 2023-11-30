from flask import Flask, request, jsonify
import assistant  # Importing your assistant script
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/get_response', methods=['POST'])
def get_response():
    user_message = request.json.get('message')
    api_key = request.json.get('api_key')
    response = assistant.main(user_message, api_key)  # Call the main function from your assistant script
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True)