<script lang="ts">
  import Icon from '@iconify/svelte';
  import Loading from './Loading.svelte';

  interface Meal {
    name: string;
    tagline: string;
    ingredients: string;
    instructions: string;
    simplicity: string,
    time: string,
    imageUrl: string | undefined,
  }

  interface MealDetails {
    ingredients: string[];
    instructions: string[];
    summary: string;
  }

  export let meal: Meal;
  export let mealDetails: MealDetails;
</script>


<div class="meal">
  <h1>{meal.name}</h1>
  <h3 class="centered-text"><i>{meal.tagline}</i></h3>
  <p>{mealDetails.summary}</p>
  <div class="meal-info">
    <div>
      <p><Icon icon="la:stopwatch"/>Time: {meal.time} minutes</p>
      <p><Icon icon="ion:ribbon"/>Simplicity: {meal.simplicity}</p>
      <h2>Ingredients:</h2>
      <ul>
        {#each mealDetails.ingredients as ingredient}
          <li>- {ingredient}</li>
        {/each}
      </ul>
    </div>
    {#if !meal.imageUrl}
      <Loading size={24} color="#74F97B"/>
    {:else}
      <img class="meal-image" src={meal.imageUrl} alt={meal.name} />
    {/if}
  </div>
  <h2>Instructions:</h2>
  <ol>
    {#each mealDetails.instructions as instruction, i}
      <li>{i + 1}. {instruction}</li>
    {/each}
  </ol>
</div>

<style>
  p {
    white-space: pre-line;
  }

  .meal {
    width: 100%;
  }

  .meal-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1em;
  }

  .meal-image {
    display: block;
    width: 256px;
    height: 256px;
    box-shadow: 0 0 5px 1px var(--color-theme-3);
  }

  .centered-text {
    text-align: center;
  }

  /* The following is to reset the ul and ol styling */
  ul, ol {
    list-style: none;
    padding: 0;
    margin: 0;
  }
</style>
