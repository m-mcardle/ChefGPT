<script lang="ts">
  import { onMount } from 'svelte';
	import chef from '$lib/images/chef2.png';
  import Loading from './Loading.svelte';

  interface Ingredient {
    name: string;
    image: string;
  }

  interface Meal {
    name: string;
    ingredients: string;
    instructions: string;
    simplicity: string,
    time: string,
  }

  interface MealDetails {
    ingredients: string;
    instructions: string;
  }

  let ingredients: Ingredient[] = [];
  let meals: Meal[] = [];
  let selectedMeal: Meal | undefined;
  let moreDetails: MealDetails | undefined;
  let loading = false;
  let error = false;

	async function generate() {
    console.log('Generating meals for ingredients:', ingredients.toString());
    selectedMeal = undefined;
    loading = true;
    try {
      const response = await fetch('http://127.0.0.1:8080/api/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: ingredients.toString(),
        })
      });

      meals = (await response.json()).response;
      console.log('Meals Response:', meals);
    } catch (e) {
      error = true;
      console.error(e);
    } finally {
      loading = false;
    }
	}

	async function generateMoreDetails(meal: Meal) {
    console.log('Getting more details for meal:', meal)
    selectedMeal = meal;
    loading = true;
    try {
		const response = await fetch('http://127.0.0.1:8080/api/details', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				prompt: meal
			})
		});

		moreDetails = (await response.json()).response;
    loading = false;
    console.log('Details Response:', moreDetails);
    } catch (e) {
      error = true;
      console.error(e);
    } finally {
      loading = false;
    }
	}

  onMount(() => {
    // Get the selected ingredients from local storage and parse the JSON string
    const savedIngredients = localStorage.getItem('selectedIngredients');
    if (savedIngredients) {
      ingredients = JSON.parse(savedIngredients);
    }
  });
</script>

<svelte:head>
	<title>MealGPT 🧑‍🍳</title>
	<meta name="description" content="ChatGPT-Powered Recipe Tool" />
</svelte:head>

<div class="text-column">
  
  <span class="logo">
    <picture>
      <source srcset={chef} type="image/png" />
      <img src={chef} alt="MealGPT Chef Avatar" />
    </picture>
  </span>

  <h1>MealGPT 🧑‍🍳</h1>
  <h2>
    This is a <a href="https://openai.com/blog/better-language-models/">GPT-3</a> powered assistant that provides suggested meals and their recipes based on what ingredients you have available.
  </h2>

  <p>
    You currently have {ingredients.length} ingredients selected. Click <a href="/ingredients">here</a> to select more ingredients or view your selections!
  </p>

  {#if loading}
    <div class="loading">
      <h2>We're cooking up some tasty recipes! Just one moment...</h2>
      <Loading size={48} color="#74F97B"/>
    </div>
  {:else}
  <div class="output">
    {#if moreDetails && selectedMeal}
      <div class="meal">
        <h3>{selectedMeal.name}</h3>
        <p>Time: {selectedMeal.time}</p>
        <p>Simplicity: {selectedMeal.simplicity}</p>
        <p>
          Ingredients:
          {moreDetails.ingredients}
        </p>
        <p>
          Instructions:
          {moreDetails.instructions}
        </p>
      </div>
    {:else if meals.length > 0}
      {#each meals as meal}
        <div class="meal">
          <h3>{meal.name}</h3>
          <p>Ingredients: {meal.ingredients}</p>
          <p>Instructions: {meal.instructions}</p>
          <p>Time: {meal.time}</p>
          <p>Simplicity: {meal.simplicity}</p>
          <button on:click={() => generateMoreDetails(meal)}>View More Details</button>
        </div>
      {/each}
    {:else}
      {#if error}
        <h2>Oops! Something went wrong. Let's try that again!</h2>
      {:else}
        <h2>Click the button below to generate some recipes!</h2>
      {/if}
      <button
        disabled={!ingredients.length}
        on:click={generate}
      >
        Generate Recipes
      </button>
    {/if}
  </div>
  {/if}
</div>

<style>
  .loading {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 1em 0;
  }

  .output {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 1em 0;
  }

  p {
    white-space: pre-line;
  }

  .logo {
		display: block;
    margin: 0 auto;
	}

	.logo img {
		width: 250px;
    height: 250px;
		top: 0;
		display: block;
	}
</style>
