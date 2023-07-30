<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';

  import { doc, setDoc, collection } from "firebase/firestore";
  import { onAuthStateChanged } from "firebase/auth";

  import { db, auth, trackError, trackScreenView, trackEvent } from '$lib/firebase/index';

  import ChefImage from '$lib/images/chef.png';
  import Loading from '$lib/components/Loading.svelte';
  import MealsView from './MealsView.svelte';
  import MealDetailsView from './MealDetailsView.svelte';
  import GoogleSignIn from '$lib/components/GoogleSignIn.svelte';

  const apiUrl = '/api'

  let user = auth.currentUser;
  let ingredients: string[] = [];
  let meals: Meal[] = [];
  let selectedMeal: Meal | undefined;
  let moreDetails: MealDetails | undefined;
  let loading = false;
  let error = false;

  onAuthStateChanged(auth, (newUser) => {
    console.log('User state changed:', newUser)
    user = newUser;
  });

  async function generate() {
    trackEvent('generate', {
      user_id: user?.uid,
      ingredients: ingredients.toString(),
    });

    console.log('Generating meals for ingredients:', ingredients.toString());
    selectedMeal = undefined;
    loading = true;
    try {
      const response = await fetch(`${apiUrl}/suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: ingredients.toString(),
        })
      });

      meals = (await response.json()).response?.meals;
      console.log('Meals Response:', meals);

      await Promise.allSettled(meals.map(async (meal, i) => {
        const mealName = `${meal.name} made with ${meal.ingredients}`
        const imageResponse = await fetch(`${apiUrl}/generate_image?name=${mealName}`);
        meals[i].imageUrl = (await imageResponse.json()).response;
      }));

      console.log('Meals with images:', meals);
      localStorage.setItem('meals', JSON.stringify(meals));
    } catch (e) {
      error = true;
      console.error(e);

      if (e instanceof Error) {
        trackError(e, 'generate_error');
      } else {
        trackError(new Error('Unknown error'), 'generate_error');
      }
    } finally {
      loading = false;
    }
  }

  async function generateMoreDetails(meal: Meal) {
    trackEvent('generate_more_details', {
      user_id: user?.uid,
      meal_name: meal.name,
    });

    console.log('Getting more details for meal:', meal)
    selectedMeal = meal;
    localStorage.setItem('selectedMeal', JSON.stringify(meal));
    loading = true;
    try {
    const response = await fetch(`${apiUrl}/details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: meal
      })
    });

    moreDetails = (await response.json()).response;
    console.log('Details Response:', moreDetails);

    localStorage.setItem('mealDetails', JSON.stringify(moreDetails));

    if (moreDetails && user) {
      console.log('Saving meal to Firestore:', meal);

      // Add a new document with a generated id
      const newRecipeRef = doc(collection(db, "Recipes"));

      await setDoc(newRecipeRef, {
        name: meal.name,
        tagline: meal.tagline,
        summary: moreDetails.summary,
        simpleIngredients: meal.ingredients,
        ingredients: moreDetails.ingredients,
        simpleInstructions: meal.instructions,
        instructions: moreDetails.instructions,
        calories: meal.calories,
        imageUrl: meal.imageUrl,
        time: meal.time,
        simplicity: meal.simplicity,
        userUID: user.uid,
      });
    }
    } catch (e) {
      error = true;
      console.error(e);

      if (e instanceof Error) {
        trackError(e, 'generate_more_error');
      } else {
        trackError(new Error('Unknown error'), 'generate_more_error');
      }
    } finally {
      loading = false;
    }
  }

  function clear() {
    if (moreDetails) {
      moreDetails = undefined;
      localStorage.removeItem('mealDetails');
      selectedMeal = undefined;
      localStorage.removeItem('selectedMeal');
    } else if (meals.length) {
      meals = [];
      localStorage.removeItem('meals');
    }
    error = false;
  }

  onMount(() => {
    trackScreenView('home');

    console.log('Home Loaded!');

    // Get the selected ingredients from local storage and parse the JSON string
    const savedIngredients = localStorage.getItem('selectedIngredients');
    if (savedIngredients) {
      ingredients = JSON.parse(savedIngredients);
    }

    const savedMeals = localStorage.getItem('meals');
    if (savedMeals) {
      meals = JSON.parse(savedMeals);
    }

    const savedMoreDetails = localStorage.getItem('mealDetails');
    if (savedMoreDetails) {
      moreDetails = JSON.parse(savedMoreDetails);
    }

    const savedSelectedMeal = localStorage.getItem('selectedMeal');
    if (savedSelectedMeal) {
      selectedMeal = JSON.parse(savedSelectedMeal);
    }
  });
</script>

<svelte:head>
  <title>ChefGPT</title>
  <meta name="description" content="ChatGPT-Powered Recipe Tool" />
</svelte:head>

<div class="text-column">
  {#if meals.length || moreDetails}
    <button class="close" on:click={clear}>
      <Icon icon="ion:close" style="font-size: 36px" />
    </button>
  {/if}

  {#if !user || (!loading && !meals.length && !moreDetails)}
  <span class="logo">
    <picture>
      <source srcset={ChefImage} type="image/png" />
      <img src={ChefImage} alt="ChefGPT Chef Avatar" />
    </picture>
  </span>

  <h1>ChefGPT 🧑‍🍳</h1>
  <h3>
    This is a <a href="https://openai.com/blog/gpt-3-apps">GPT-3</a> powered assistant that provides suggested meals and their recipes based on what ingredients you have available.
  </h3>

  <p class="centered-text">
    You currently have {ingredients.length} ingredients selected. Click <a href="/ingredients">here</a> to select more ingredients or view your selections!
  </p>
  {/if}


  {#if loading}
    <div class="loading">
      {#if selectedMeal}
        <h2>Cooking up some more details about your {selectedMeal.name}! Just one moment...</h2>
      {:else}
        <h2>We're cooking up some tasty recipes! Just one moment...</h2>
      {/if}
      <Loading size={48} color="#74F97B"/>
    </div>
  {:else}
  <div class="output">
    {#if !user}
      <GoogleSignIn />
    {:else if moreDetails && selectedMeal}
      <MealDetailsView meal={selectedMeal} mealDetails={moreDetails} />
    {:else if meals.length > 0}
      <MealsView meals={meals} generateMoreDetails={generateMoreDetails} />
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
    width: 100%;
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

  .close {
    position: absolute;
    top: 1em;
    left: 1em;
    background: none;
    border: none;
    cursor: pointer;
    color: #74F97B;
  }
</style>
