import { error, json } from '@sveltejs/kit';
import OpenAI from 'openai';
import uuid from 'uuid-v4'
import { OPENAI_API_KEY } from '$env/static/private';
import type { Config } from '@sveltejs/adapter-vercel';

export const config: Config = {
    runtime: 'edge'
};

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const getImage = async (description: string): Promise<string> => {
  console.log(`Getting image of ${description}`);
  const response = await openai.images.generate({
    prompt: description,
    n: 1,
    size: '1024x1024',
  });
  console.log(response);
  const image_url = response.data[0].url;

  if (!image_url) {
    throw error(500, 'Failed to generate image');
  }
  return image_url;
};

export async function GET({ url }) {
  const prompt = url.searchParams.get('prompt');
  const fullPrompt = `Professional meal depiction of ${prompt} with a dark background. Homecooked meal. Very tasty. Ultra realistic.`
  const imageUrl = await getImage(fullPrompt);
  if (!imageUrl) {
    throw error(500, 'Failed to generate image');
  }

  const safeImageUrl = encodeURIComponent(imageUrl);
  const saveImageResponse = await fetch(`/api/save_image?imageUrl=${safeImageUrl}&imageId=${uuid()}`);
  const { response } = await saveImageResponse.json() as { response: string };
  return json({ response });
};
