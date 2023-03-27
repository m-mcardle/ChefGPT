import os
import openai
from dotenv import load_dotenv
import logging

# Set up logging
logger = logging.getLogger(__name__)
handler = logging.StreamHandler()
handler.setLevel(logging.INFO)
formatter = logging.Formatter('[CHAT_GPT] %(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)
logger.setLevel(logging.INFO)

load_dotenv()

# Load your API key from an environment variable or secret management service
openai.api_key = os.getenv("OPENAI_API_KEY")

context_prompt = """
Your purpose is to generate lists of possible meals for a user.
They will provide a list of ingredients that they have available and you must suggest two meals that they can make.
Answer in the format:
1. [Meal name]:
Ingredients: [ingredients on one line]
Instructions: [instructions on one line]
Time: [time]
Simplicity: [simplicity]
"""

more_details_context_prompt = """
Your purpose is to extrapolate a simple description of a meal into full instructions.
They will provide the details of the meal they wish to prepare and you must provide the full ingredients and instructions.
Answer in the format:
Ingredients:
- [ingredient]

Instructions:
1. [instruction]
"""

static_output = """
1. Grilled Chicken Salad
Ingredients: Chicken, Lettuce, Bell peppers
Instructions: Grill the chicken until cooked through. Chop the lettuce and bell peppers into bite-sized pieces. Combine the lettuce, bell peppers, and chicken in a large bowl. Drizzle with your favorite dressing and serve.
Time: 20 minutes
Simplicity: Easy

2. Egg Salad Sandwich
Ingredients: Eggs, Lettuce
Instructions: Hard boil the eggs, peel and chop them into small pieces. Mix the eggs with a tablespoon of mayonnaise, salt, and pepper. Toast the bread and place lettuce on one slice. Spread the egg mixture on the lettuce and top with the other slice of bread.
Time: 15 minutes
Simplicity: Easy
"""

static_more_details_output = """
Ingredients:
- 2 chicken breasts
- 4 cups lettuce
- 1 red bell pepper
- 1 yellow bell pepper
- Your favorite salad dressing

Instructions:
1. Preheat a grill or grill pan to medium-high heat.
2. Season the chicken breasts with salt and pepper.
3. Grill the chicken for 6-7 minutes on each side or until cooked through.
4. Remove the chicken from the grill and let it rest for 5 minutes.
5. While the chicken is resting, chop the lettuce and bell peppers into bite-sized pieces.
6. Slice the chicken into thin strips.
7. Combine the lettuce, bell peppers, and chicken in a large bowl.
8. Drizzle with your favorite salad dressing and toss to combine.
9. Serve immediately.
"""

def parse_response(response):
    meals = response.split('\n\n')
    parsed_meals = []
    for meal in meals:
        parsed_meals.append({
            'name': meal.split('Ingredients:')[0].split('. ')[1].strip(),
            'ingredients': meal.split('Ingredients:')[1].split('Instructions:')[0].strip(),
            'instructions': meal.split('Instructions:')[1].split('Time:')[0].strip(),
            'time': meal.split('Time:')[1].split('Simplicity:')[0].strip(),
            'simplicity': meal.split('Simplicity:')[1].strip(),
        })
    return parsed_meals

def parse_more_details_response(response):
    sections = response.split('\n\n')
    ingredients = sections[0].split('Ingredients:')[1].strip()
    instructions = sections[1].split('Instructions:')[1].strip()
    return {
        'ingredients': ingredients,
        'instructions': instructions,
    }

def get_response(prompt):
    logger.info('Prompt: ' +  prompt)

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-0301",
        messages=[
          {"role": "system", "content": context_prompt},
          {"role": "user", "content": f"Ingredients: {prompt}"},
        ],
        temperature=0.5,
        max_tokens=300,
    )
    answer = response.choices[0].message.content
    logger.debug('Response:\n' + answer)
    parsed_response = parse_response(answer)
    return parsed_response

def get_more_details_response(prompt):
    logger.info('Prompt: ' + prompt)

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-0301",
        messages=[
          {"role": "system", "content": more_details_context_prompt},
          {"role": "user", "content": prompt},
        ],
        temperature=0.5,
        max_tokens=400,
    )
    answer = response.choices[0].message.content
    logger.debug('Response:\n' + answer)
    parsed_response = parse_more_details_response(answer)
    return parsed_response