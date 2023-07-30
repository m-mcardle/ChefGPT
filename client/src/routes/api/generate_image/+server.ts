import { error, json } from '@sveltejs/kit';
import { Configuration, OpenAIApi } from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';
import { Storage } from '@google-cloud/storage';
import uuid from 'uuid-v4'
import fs from 'fs';
import nodeFetch from 'node-fetch';

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const storage = new Storage();
const bucketName = "chef_gpt_generated_images";

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

  const imageId = uuid();
  const filename = `${imageId}.png`;
  const fileStream = fs.createWriteStream(filename);

  const response = await nodeFetch(imageUrl);
  if (!response.ok || !response.body) {
    throw new Error(`Failed to fetch the file. Status: ${response.status} - ${response.statusText}`);
  }
  await new Promise((resolve, reject) => {
    response.body?.pipe(fileStream);
    fileStream.on('finish', resolve);
    fileStream.on('error', reject);
  });

  const bucket = storage.bucket(bucketName);
  const uploadResponse = await bucket.upload(filename);

  // Delete image at filename
  fs.unlink(filename, (err) => {
    if (err) {
      console.error(err);
      return error(500);
    }
  });
  return json({ response: uploadResponse[0].publicUrl() });
};
