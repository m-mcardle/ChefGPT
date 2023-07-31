# ChefGPT 👨‍🍳🤖

## AI Powered Cooking Application

### Description 📚

ChefGPT is a web application that leverages ChatGPT to provide recipes based on the ingredients the user has available to them.

### Infrastructure 🏗️

The front end of this app was written in Svelte and built using SvelteKit. The backend is mainly serverless functions that the client will fetch the recipes from. In these functions we generate the suggestions by using the OpenAI ChatCompletion SDK and then parse the responses into a consumable format for the front-end. The application is hosted on Vercel.

### Related Concepts / Learnings 💭

* Svelte
* SveleteKit
* OpenAI/ChatGPT
* Google Cloud
* Vercel
* Edge Functions
* Serverless Functions

<hr>
<br>

## Client

The client for this application is built using Svelte.

## API

The backend for this application consists of Edge and Serverless functions hosted on Vercel. These function use the [OpenAI SDK](https://platform.openai.com/docs/api-reference/introduction) to generate the recipes and then parses them before returning them to the client. We also generate images for each meal using DALL-E 2 and store them in Google Cloud Storage.

## Development

Once you've installed dependencies with `npm install`, start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Deploy

This app is automatically deployed to Vercel. You can access it [here](https://chef-gpt.vercel.app/)!