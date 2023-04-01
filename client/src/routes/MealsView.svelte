<script lang="ts">
  import Icon from '@iconify/svelte';
  import Loading from './Loading.svelte';

  export let meals: Meal[] = [];
  export let generateMoreDetails: (meal: Meal) => void;
</script>

<svelte:head>
	<title>ChefGPT</title>
	<meta name="description" content="ChatGPT-Powered Recipe Tool" />
</svelte:head>

{#each meals as meal}
  <div class="meal">
    <div class="meal-heading">
      <div class="meal-name">
        <h2>{meal.name}</h2>
        <i>{meal.tagline}</i>
      </div>
    </div>
    <hr/>
    <div class="meal-details">
      <div class="meal-info">
        <p>Ingredients: {meal.ingredients}</p>
        <p>Instructions: {meal.instructions}</p>
        <p><Icon icon="la:stopwatch"/>Time: {meal.time} minutes</p>
        <p><Icon icon="ion:ribbon"/>Simplicity: {meal.simplicity}</p>
        <button on:click={() => generateMoreDetails(meal)}>View More Details</button>
      </div>
      {#if !meal.imageUrl}
        <Loading size={24} color="#74F97B"/>
      {:else}
        <img class="meal-image-small" src={meal.imageUrl} alt={meal.name} />
      {/if}
    </div>
  </div>
{/each}

<style>
  p {
    white-space: pre-line;
  }

  .meal {
    margin-bottom: 8px;
    width: 100%;
  }

  .meal-image-small {
    display: block;
    width: 150px;
    height: 150px;
    box-shadow: 0 0 5px 1px var(--color-theme-3);
  }

  .meal-name {
    align-self: flex-end;
  }

  .meal-heading {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .meal-details {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .meal-info {
    max-width: 80%;
  }
</style>
