<script lang="ts">
  import Icon from '@iconify/svelte';
  import Loading from '$lib/components/Loading.svelte';
  import IntersectionObserver from '$lib/components/IntersectionObserver.svelte';
  import Image from '$lib/components/Image.svelte';

  export let meals: Meal[] = [];
  export let generateMoreDetails: (meal: Meal) => void;
</script>

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
        <p>Calories: {meal.calories}</p>
        <p><Icon icon="la:stopwatch"/>Time: {meal.time} minutes</p>
        <p><Icon icon="ion:ribbon"/>Simplicity: {meal.simplicity}</p>
        <button on:click={() => generateMoreDetails(meal)}>View More Details</button>
      </div>
      {#if !meal.imageUrl}
        <Loading size={24} color="#74F97B"/>
      {:else}
        <div>
          <IntersectionObserver once={true} let:intersecting={intersecting}>
            {#if intersecting}
              <Image src={meal.imageUrl} alt={meal.name} --size="150px"/>
            {/if}
          </IntersectionObserver>
        </div>
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
    width: 100%;
  }

  .meal-info {
    max-width: 80%;
  }
</style>
