import os
import urllib.request
from google.cloud import storage
from dotenv import load_dotenv
import uuid

load_dotenv()

# Set Google Cloud Storage bucket details
bucket_name = "chef_gpt_generated_images"
public_url = f"https://storage.googleapis.com/{bucket_name}"

# Create a new Google Cloud Storage client
storage_client = storage.Client()

# Get a reference to the destination bucket
bucket = storage_client.bucket(bucket_name)

def upload_image(url):
  image_uuid = uuid.uuid4()
  file_name = f"{image_uuid}.png"

  # Download the image from the URL
  urllib.request.urlretrieve(url, file_name)

  # Get a reference to the destination blob
  blob = bucket.blob(file_name)

  # Upload the image to the bucket
  blob.upload_from_filename(file_name)

  # Delete the downloaded image
  os.remove(file_name)

  print(f"Image uploaded to gs://{bucket_name}/{file_name}")
  return f"{public_url}/{file_name}"

if __name__ == "__main__":
  # Set URL of the image to be downloaded
  url = "https://www.gstatic.com/webp/gallery3/1.sm.png"
  upload_image(url)
    
