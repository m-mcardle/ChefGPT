<script lang="ts">
  import Icon from '@iconify/svelte';
  import Image from '$lib/components/Image.svelte';
  import IntersectionObserver from '$lib/components/IntersectionObserver.svelte';
  import Loading from '$lib/components/Loading.svelte';

  export let meal: Meal;
  export let mealDetails: MealDetails;
</script>


<div class="meal">
  <h1>{meal.name}</h1>
  <h3 class="centered-text"><i>{meal.tagline}</i></h3>
  <p>{mealDetails.summary}</p>
  <div class="meal-info">
    <div>
      <p>Calories: {meal.calories}</p>
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
    <div>
      <IntersectionObserver once={true} let:intersecting={intersecting}>
        {#if intersecting}
          <Image src={meal.imageUrl} alt={meal.name} --size="256px"/>
        {/if}
      </IntersectionObserver>
    </div>
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

  /* The following is to reset the ul and ol styling */
  ul, ol {
    list-style: none;
    padding: 0;
    margin: 0;
  }
</style>
