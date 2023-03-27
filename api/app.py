from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
import json

from chatgpt_service import get_response, get_more_details_response

app = Flask(__name__)
cors = CORS(app)

# Set up logging
app.logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
handler.setLevel(logging.INFO)
formatter = logging.Formatter('[APP] %(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
app.logger.addHandler(handler)

@app.route('/api/suggest', methods=['POST', 'OPTIONS'])
def suggest():
  app.logger.info('Processing request')
  # Set CORS headers for the preflight request
  if request.method == 'OPTIONS':
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    }
    return ('', 204, headers)

  # Handle the main request
  data = request.get_json()
  prompt = data['prompt']
  app.logger.info('Requested prompt: ' + prompt)
  return jsonify({'response': get_response(prompt)})


@app.route('/api/details', methods=['POST', 'OPTIONS'])
def details():
  app.logger.debug('Processing request')
  # Set CORS headers for the preflight request
  if request.method == 'OPTIONS':
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    }
    return ('', 204, headers)

  # Handle the main request
  data = request.get_json()
  prompt = json.dumps(data['prompt'])
  app.logger.debug('Requested prompt: ' + prompt)
  return jsonify({'response': get_more_details_response(prompt)})

if __name__ == '__main__':
    app.run(debug=True, port=8080)
