import { error, json } from '@sveltejs/kit';
import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import nodeFetch from 'node-fetch';
import type { Config } from '@sveltejs/adapter-vercel';

export const config: Config = {
    runtime: 'nodejs18.x'
};

const storage = new Storage();
const bucketName = "chef_gpt_generated_images";

async function uploadToBucket(filename: string, imageUrl: string) {
  const fileStream = fs.createWriteStream(filename);

  console.log(`Fetching image from ${imageUrl}`);
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
  return uploadResponse[0].publicUrl();
}

export async function GET({ url }) {
  const imageUrl = url.searchParams.get('imageUrl');
  const imageId = url.searchParams.get('imageId');
  if (!imageUrl || !imageId) {
    throw error(400, 'Missing required params')
  }

  const filename = `${imageId}.png`;
  const fileUrl = await uploadToBucket(filename, imageUrl);
  return json({ response: fileUrl });
};
