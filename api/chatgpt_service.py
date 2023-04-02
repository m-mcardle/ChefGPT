import os
import openai
from dotenv import load_dotenv
import logging
import json

from google_service import upload_image

log_level = logging.DEBUG if os.environ.get('DEV') != None else logging.INFO

# Set up logging
logger = logging.getLogger(__name__)
handler = logging.StreamHandler()
handler.setLevel(log_level)
formatter = logging.Formatter('[CHAT_GPT] %(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)
logger.setLevel(log_level)

load_dotenv()

# Load your API key from an environment variable or secret management service
openai.api_key = os.getenv("OPENAI_API_KEY")

context_prompt = """
Your purpose is to generate lists of possible meals for a user.
They will provide a list of ingredients that they have available and you must suggest three meals that they can make.
Answer using JSON in the format:
```
{
  "meals": [
    {
      "name": "[Meal name]",
      "tagline": "[Meal tagline]",
      "ingredients": "[ingredients summarized on one line]",
      "instructions": "[instructions summarized on one line]",
      "time": [minutes],
      "simplicity": "[Easy/Medium/Hard]",
      "calories": [estimated calories per serving]
    },
    ...
  ] 
}
```
Do not say anything other than the JSON.
"""

more_details_context_prompt = """
Your purpose is to extrapolate a simple description of a meal into full instructions.
They will provide the details of the meal they wish to prepare and you must provide the full ingredients and instructions.
Provide the exact measurements of ingredients and the exact and complete list of the instructions.
Answer using JSON in the format:
```
{
  "ingredients": [
    "[ingredient]",
    ...
  ],
  "instructions": [
    "[instruction - do not number the steps]",
    ...
  ],
  "summary": "[provide a paragraph artistic description of the meal and its flavours as a recap from the perspective of a professional chef who is giving their opinion on the meal]"
}
Do not say anything other than the JSON.
"""

static_output = """
{
  "meals": [
    {
      "name": "Beef and Broccoli Stir Fry",
      "tagline": "A classic Chinese dish that's quick and easy to make",
      "ingredients": "Beef, Broccoli, Bell Peppers, Carrots, Onions, Garlic, Butter",
      "instructions": "Stir fry beef in butter, add garlic and vegetables, then finish with a soy sauce and cornstarch slurry.",
      "time": 30,
      "simplicity": 3
    },
    {
      "name": "Chicken and Broccoli Alfredo",
      "tagline": "A creamy pasta dish with plenty of vegetables",
      "ingredients": "Chicken, Broccoli, Garlic, Butter, Basil",
      "instructions": "Cook chicken in butter, add garlic and broccoli, then stir in a homemade alfredo sauce with fresh basil.",
      "time": 45,
      "simplicity": 2
    },
    {
      "name": "Stuffed Bell Peppers",
      "tagline": "A hearty and healthy meal in one",
      "ingredients": "Bell Peppers, Beef, Rice, Onions, Garlic",
      "instructions": "Stuff bell peppers with a mixture of cooked beef, rice, onions, and garlic, then bake until tender.",
      "time": 60,
      "simplicity": 2
    }
  ]
}
"""

static_more_details_output = """
{
  "ingredients": [
    "Chicken",
    "Broccoli",
    "Butter",
    "Garlic",
    "Basil",
    "Pasta",
    "Alfredo sauce"
  ],
  "instructions": [
    "Cook pasta according to package instructions.",
    "Melt butter in a large skillet over medium heat.",
    "Add chicken to the skillet and cook until no longer pink, about 5-7 minutes.",
    "Add garlic and broccoli to the skillet and cook for an additional 3-5 minutes, until the broccoli is tender.",
    "Add cooked pasta and alfredo sauce to the skillet and toss until everything is well coated.",
    "Sprinkle basil over the top and serve hot."
  ],
}
"""

static_image_url = "https://oaidalleapiprodscus.blob.core.windows.net/private/org-PewlNZmAa3PYi4qIdR9RZ4gZ/user-rgZMILzXO2LIZMjUlBh54qNT/img-P2JVxFyPCdLyjlGIu4OaGb49.png?st=2023-03-30T03%3A11%3A52Z&se=2023-03-30T05%3A11%3A52Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-03-29T12%3A04%3A43Z&ske=2023-03-30T12%3A04%3A43Z&sks=b&skv=2021-08-06&sig=9TwyjdOdMj8Bz383W3RWNP1GifMKVK1TZeiLVz6N1UE%3D"

def get_response(prompt):
    logger.debug('Prompt: ' +  prompt)

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
          {"role": "system", "content": context_prompt},
          {"role": "user", "content": f"Ingredients: {prompt}"},
        ],
        temperature=0.5,
        max_tokens=400,
    )
    answer = response.choices[0].message.content
    parsed_response = json.loads(answer)
    return parsed_response

def get_more_details_response(prompt):
    logger.info('Prompt: ' + json.dumps(prompt))

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
          {"role": "system", "content": more_details_context_prompt},
          {"role": "user", "content": f"{prompt['name']} - {prompt['tagline']}. Basic Ingredients: {prompt['ingredients']} - Basic Instructions: {prompt['instructions']}"},
        ],
        temperature=0.5,
        max_tokens=500,
    )
    answer = response.choices[0].message.content
    parsed_response = json.loads(answer)
    return parsed_response

def generate_image(prompt):
    full_prompt = f"Professional meal depiction of {prompt} with a dark background. Homecooked meal. Very tasty. Ultra realistic."
    logger.debug('Prompt: ' + full_prompt)

    response = openai.Image.create(
      prompt=full_prompt,
      n=1,
      size="1024x1024",
    )
    image_url = response['data'][0]['url']
    logger.debug('Image URL: ' + image_url)
    google_uri = upload_image(image_url)
    return google_uri