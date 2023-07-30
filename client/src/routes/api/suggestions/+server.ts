import { error, json } from '@sveltejs/kit';
import { Configuration, OpenAIApi } from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const suggestions_prompt = `
Your purpose is to generate lists of possible meals for a user.
They will provide a list of ingredients that they have available and you must suggest three meals that they can make.
Answer using JSON in the format:
\`\`\`
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
\`\`\`
Do not say anything other than the JSON.
`;

const getSuggestions = async (ingredients: string[]): Promise<string | undefined> => {
  console.log(`Getting suggestions for ${ingredients.length} ingredients`);
  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {role: "system", content: suggestions_prompt},
      {role: "user", content: `Ingredients: ${ingredients}`}
    ],
    max_tokens: 800,
    temperature: 0.5
  });
  const message = chatCompletion.data.choices[0].message?.content;
  console.debug(message);
  return message;
};

export async function POST({ request }) {
  const data = await request.json();
  const suggestions = await getSuggestions(data.ingredients);
  if (!suggestions) {
    throw error(500, 'Failed to generate suggestions')
  }

  const response = JSON.parse(suggestions);
  return json({ response });
};
