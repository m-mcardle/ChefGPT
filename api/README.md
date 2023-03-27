# MealGPT API

This directory contains the code required for running MealGPT's Flask API which leverages [OpenAI](https://platform.openai.com/docs/api-reference/introduction) to generate recipes.

## Development

To start the development server follow these steps:

1. Create/start the virtual environment: `python -m venv venv; source venv/bin/activate`
2. Install the projects dependencies: `pip install -r requirements.txt`
3. Start the development server: `python app.py`

## Build

This application is built using Docker. To easily build the image run `make build` and to start the container run `make run`
