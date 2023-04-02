<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';

  import { getDocs, collection, where, query } from "firebase/firestore";
  import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

  import { db, auth, trackError, trackEvent, trackScreenView } from '$lib/firebase';

  import Loading from '../Loading.svelte';
	import MealsView from '../MealsView.svelte';
	import MealDetailsView from '../MealDetailsView.svelte';

  const provider = new GoogleAuthProvider();

  let meals: FullMeal[] = [];
  let user = auth.currentUser;

  let basicMeals: Meal[] = [];
  $: basicMeals = meals.map((meal) => {
    return {
      ...meal,
      ingredients: meal.simpleIngredients,
      instructions: meal.simpleInstructions,
    };
  });

  let selectedMeal: Meal | undefined;
  let moreDetails: MealDetails | undefined;
  let loading = false;
  let error = false;

	function viewMoreDetails(meal: Meal) {
    trackEvent('view_more_details_saved', {
      meal_name: meal.name,
      meal_ingredients: meal.ingredients,
    });
    console.log('Getting more details for meal:', meal)
    moreDetails = meals.find((m) => m.name === meal.name);
    selectedMeal = meal;
	}

  function login() {
    signInWithPopup(auth, provider)
      .then((result) => {
        user = result.user;
      }).catch((error) => {
        console.error(error);
        trackError(error, 'login_error');
      });
  }

  $: if (user) {
    fetchMeals();
  }

  async function fetchMeals() {
    if (!auth.currentUser) {
      login();
      return;
    }

    loading = true;
    error = false;
    try {
      const recipesRef = collection(db, "Recipes");
      const recipeQuery = query(recipesRef, where("userUID", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(recipeQuery);
      meals = []
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userUID === auth.currentUser?.uid) {
          meals.push(data as FullMeal);
        }
      });
      meals = meals;
    } catch (e) {
      error = true;
      console.error(e);

      if (e instanceof Error) {
        trackError(e, 'fetch_meals_error');
      } else {
        trackError(new Error('Unknown error'), 'fetch_meals_error');
      }
    } finally {
      loading = false;
    }
  }

  function clear() {
    if (moreDetails) {
      moreDetails = undefined;
      selectedMeal = undefined;
    }
    error = false;
  }

  onMount(() => {
    console.log('auth.currentUser:', user);
    if (!user) {
      login();
    } else {
      trackScreenView('saved_meals');

      fetchMeals();
    }
  });
</script>

<svelte:head>
	<title>ChefGPT - Your Recipes</title>
	<meta name="description" content="ChatGPT-Powered Recipe Tool" />
</svelte:head>

<div class="text-column">
  {#if moreDetails}
    <button class="close" on:click={clear}>
      <Icon icon="ion:close" style="font-size: 36px" />
    </button>
  {/if}

  {#if loading}
    <div class="loading">
      <h2>We're cooking up some tasty recipes! Just one moment...</h2>
      <Loading size={48} color="#74F97B"/>
    </div>
  {:else}
  <div class="output">
    {#if moreDetails && selectedMeal}
      <MealDetailsView meal={selectedMeal} mealDetails={moreDetails} />
    {:else if meals.length > 0}
      <MealsView meals={basicMeals} generateMoreDetails={viewMoreDetails} />
    {:else}
      {#if error}
        <h2>Oops! Something went wrong. Let's try that again!</h2>
      {:else}
        <h2>No recipes here! Go generate some more recipes and they will appear here!</h2>
      {/if}
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
