import { error, json } from '@sveltejs/kit';
import { Configuration, OpenAIApi } from 'openai';
import uuid from 'uuid-v4'
import { OPENAI_API_KEY } from '$env/static/private';
import nodeFetch from 'node-fetch';
import type { Config } from '@sveltejs/adapter-vercel';

export const config: Config = {
    runtime: 'edge'
};

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const getImage = async (description: string): Promise<string | undefined> => {
  console.log('Getting image');
  const response = await openai.createImage({
    prompt: description,
    n: 1,
    size: '1024x1024',
  });
  const image_url = response.data.data[0].url;
  return image_url;
};

export async function GET({ url }) {
  const prompt = url.searchParams.get('prompt');
  const fullPrompt = `Professional meal depiction of ${prompt} with a dark background. Homecooked meal. Very tasty. Ultra realistic.`
  const imageUrl = await getImage(fullPrompt);
  if (!imageUrl) {
    throw error(500, 'Failed to generate image')
  }

  const safeImageUrl = encodeURIComponent(imageUrl);
  const saveImageResponse = await nodeFetch(`http://127.0.0.1:5173/api/save_image?imageUrl=${safeImageUrl}&imageId=${uuid()}`);
  const { response } = await saveImageResponse.json() as { response: string };
  return json({ response });
};
