# MenuGPT 👨‍🍳🤖

## AI Powered Cooking Application

### Description 📚

MenuGPT is a web application that leverages ChatGPT to provide recipes based on the ingredients the user has available to them.

### Infrastructure 🏗️

The front end of this app was written in Svelte and built using SvelteKit. The backend is a Python server that hosts a Flask API that the client will fetch the recipes from. On this server we generate the suggestions by using the OpenAI ChatCompletion SDK and then parse the responses into a consumable format for the front-end.

### Related Concepts / Learnings 💭

* Svelte
* Python
* Flask
* OpenAI/ChatGPT
* Docker

<hr>
<br>

## Client

The client for this application is built using Svelte. The source code is stored under the `/client` directory. To start the development server run:

```
npm run dev
```

## API

The backend for this application hosts an API using Python and Flask. It uses the [OpenAI SDK](https://platform.openai.com/docs/api-reference/introduction) to generate the recipes and then parsed them before returning them to the client. To start the server, go to the `/api` directory and run:

```
python app.py
```
