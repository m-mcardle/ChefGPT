import { error, json } from '@sveltejs/kit';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';
import type { Config } from '@sveltejs/adapter-vercel';

export const config: Config = {
    runtime: 'edge'
};

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const suggestions_prompt = `
Your purpose is to generate lists of possible meals for a user.
They will provide a list of ingredients that they have available and you must suggest a single meal that they can make.
Answer using JSON in the format:
\`\`\`
{
  "meals": [
    {
      "name": "[Meal name]",
      "tagline": "[Meal tagline]",
      "ingredients": "[Ingredients summarized on one line]",
      "instructions": "[Instructions summarized on one line. Do not number the steps just summarize the basic instructions]",
      "time": [Minutes],
      "simplicity": "[Easy/Medium/Hard]",
      "calories": [Estimated calories per serving]
    },
    ...
  ] 
}
\`\`\`
Do not say anything other than the JSON.
`;

const getSuggestions = async (ingredients: string): Promise<string> => {
  console.log(`Getting suggestions for ${ingredients}`);
  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {role: "system", content: suggestions_prompt},
      {role: "user", content: `Ingredients: ${ingredients}`}
    ],
    max_tokens: 800,
    temperature: 0.5,
  });
  const finish_reason = chatCompletion.choices[0].finish_reason;
  const message = chatCompletion.choices[0].message?.content;
  if (finish_reason !== "stop" || !message) {
    throw error(500, 'Failed to generate suggestions');
  }
  console.debug(message);
  return message;
};

export async function POST({ request }) {
  const data = await request.json();
  const suggestions = await getSuggestions(data.prompt);
  if (!suggestions) {
    throw error(500, 'Failed to generate suggestions')
  }

  const response = JSON.parse(suggestions);
  return json({ response });
};
