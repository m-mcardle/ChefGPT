from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
import json
import os

from chatgpt_service import get_response, get_more_details_response, generate_image

app = Flask(__name__)
cors = CORS(app)

log_level = logging.DEBUG if os.environ.get('DEV') != None else logging.INFO

# Set up logging
app.logger.setLevel(log_level)
handler = logging.StreamHandler()
handler.setLevel(log_level)
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
  app.logger.debug('Requested prompt: ' + prompt)
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
  prompt = data['prompt']
  app.logger.debug('Requested prompt: ' + json.dumps(prompt))
  return jsonify({'response': get_more_details_response(prompt)})

@app.route('/api/image', methods=['GET', 'OPTIONS'])
def image():
  app.logger.debug('Processing request')
  # Set CORS headers for the preflight request
  if request.method == 'OPTIONS':
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    }
    return ('', 204, headers)

  # get the name value from the query params
  name = request.args.get('name')
  app.logger.debug('Requested name: ' + name)
  # Handle the main request
  return jsonify({'response': generate_image(name)})

if __name__ == '__main__':
  port = int(os.environ.get('PORT', 8080))
  app.logger.debug('Starting app on port %d', port)
  app.run(debug=True, port=port)
