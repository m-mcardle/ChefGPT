import { error, json } from '@sveltejs/kit';
import { Configuration, OpenAIApi } from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const suggestions_prompt = `
Your purpose is to extrapolate a simple description of a meal into full instructions.
They will provide the details of the meal they wish to prepare and you must provide the full ingredients and instructions.
Provide the exact measurements of ingredients and the exact and complete list of the instructions.
Do not number the instructions, but place them in order of start to finish.
Answer using JSON in the format:
\`\`\`
{
  "ingredients": [
    "[ingredient (with quantity)]",
    ...
  ],
  "instructions": [
    "[instruction (do not number the steps)]",
    ...
  ],
  "summary": "[provide a paragraph artistic description of the meal and its flavours as a recap from the perspective of a professional chef who is giving their opinion on the meal]"
}
\`\`\`
Do not say anything other than the JSON.
`;

const getMoreDetails = async (prompt: Meal): Promise<string | undefined> => {
  console.log(`Getting more details for ${prompt.name}`);
  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {role: "system", content: suggestions_prompt},
      {role: "user", content: `${prompt.name} - ${prompt.tagline}. Basic Ingredients: ${prompt.ingredients} - Basic Instructions: ${prompt.instructions}`}
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
  const moreDetails = await getMoreDetails(data.prompt);
  if (!moreDetails) {
    throw error(500, 'Failed to get more details')
  }

  const response = JSON.parse(moreDetails);
  return json({ response });
};
