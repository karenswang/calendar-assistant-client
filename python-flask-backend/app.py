from flask import Flask, request, jsonify
import assistant  # Importing your assistant script

app = Flask(__name__)

@app.route('/get_response', methods=['POST'])
def get_response():
    user_message = request.json.get('message')
    response = assistant.main(user_message)  # Call the main function from your assistant script
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True)
