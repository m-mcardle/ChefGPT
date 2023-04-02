<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';

  import ingredients from './ingredients';

	import IntersectionObserver from '$lib/components/IntersectionObserver.svelte';
	import Image from '$lib/components/Image.svelte';

  export let selectedCategories = new Set<string>();
  export let onlyShowSelected = false;

  let selectedIngredients = new Set<string>();
  let searchText = '';

  $: filteredIngredients = ingredients.filter((ingredient) => {
    const matchesCategoryFilter = !selectedCategories.size || selectedCategories.has(ingredient.category);
    const matchesSearchFilter = !searchText || ingredient.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesSelectedFilter = !onlyShowSelected || selectedIngredients.has(ingredient.name);
    return matchesCategoryFilter && matchesSearchFilter && matchesSelectedFilter;
  });

  function selectIngredient(name: string) {
    if (selectedIngredients.has(name)) {
      // If the ingredient is already selected, remove it from the array
      selectedIngredients.delete(name);
    } else {
      // If the ingredient is not selected, add it to the array
      selectedIngredients.add(name);
    }

    // Store the selected ingredients as a JSON string in local storage
    localStorage.setItem('selectedIngredients', JSON.stringify([...selectedIngredients]));
    selectedIngredients = selectedIngredients;
  }

  function selectAll() {
    selectedIngredients = new Set([...filteredIngredients.map((ingredient) => ingredient.name), ...selectedIngredients]);
    localStorage.setItem('selectedIngredients', JSON.stringify([...selectedIngredients]));

    selectedIngredients = selectedIngredients;
  }

  function clearSelectedIngredients() {
    selectedIngredients.clear();
    localStorage.setItem('selectedIngredients', JSON.stringify([]));

    selectedIngredients = selectedIngredients;
  }
  
  onMount(() => {
    // Get the selected ingredients from local storage and parse the JSON string
    const savedIngredients = localStorage.getItem('selectedIngredients');
    if (savedIngredients) {
      selectedIngredients = new Set(JSON.parse(savedIngredients));
    }
  });
</script>

<svelte:head>
	<title>ChefGPT</title>
	<meta name="description" content="ChatGPT-Powered Recipe Tool" />
</svelte:head>

<div class="controls">
  <div class="search">
    <Icon icon="ion:search" />
    <input class="search-input" type="text" bind:value={searchText} placeholder="Search ingredients..." />
  </div>
  <div class="buttons">
    <button
      class="action-button"
      on:click={() => selectAll()}
    >
      Select All
    </button>

    <button
      class="action-button"
      on:click={() => clearSelectedIngredients()}
    >
      Clear Selections
    </button>
  </div>
</div>


<div class="grid">
  {#each filteredIngredients as ingredient}
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <div
      class:selected={selectedIngredients.has(ingredient.name)}
      class="ingredient"
      tabindex="0"
      on:click={() => selectIngredient(ingredient.name)}
      on:keypress={(e) => e.key === 'Enter' && selectIngredient(ingredient.name)}
    >
      <IntersectionObserver once={true} let:intersecting={intersecting}>
        {#if intersecting}
          <Image src={ingredient.image} alt={ingredient.name} --size="100%"/>
        {/if}
      </IntersectionObserver>
      <p class="ingredient-label">{ingredient.name.toUpperCase()}</p>
    </div>    
  {/each}
  {#if !filteredIngredients.length}
  <div class="empty">
    <i class="centered-text">No ingredients found. Try removing some of your filters to view more results</i>
  </div>
  {/if}
</div>

<h2>{selectedIngredients.size} ingredients selected</h2>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
  }

  .ingredient-label {
    color: var(--color-theme-2);
  }

  h2 {
    width: 100%;
    text-align: center;
  }

  .ingredient {
    justify-self: center;
    display: inline-block;
    background-color: white;
    position: relative;
    width: 150px;
    height: 150px;
    margin: 10px;
    overflow: hidden;
    border-radius: 10px;
  }

  .ingredient p {
    position: absolute;
    bottom: 0;
    left: -10px;
    width: 100%;
    padding: 10px;
    font-size: 12px;
    margin: 0;
    text-align: center;
    color: white;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .selected {
    box-shadow: 0 0 10px 5px var(--color-theme-1);
  }

  .controls {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 20px;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
  }

  .empty {
    min-height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    text-align: center;
  }

  .buttons {
    display: flex;
    justify-content: flex-end;
  }

  .action-button {
    max-width: 150px;
    margin-left: 10px;
  }

  .search {
    display: flex;
    align-items: center;
    margin-right: 16px;
  }

  .search-input {
    margin-left: 8px;
    min-width: 250px;
  }
</style>
