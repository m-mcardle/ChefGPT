<script lang="ts">
  import { onMount } from 'svelte';
  import ingredients from './ingredients';

  let clicked = false;
  let selectedIngredients = new Set<string>();
  let searchText = '';
  export let selectedCategories = new Set<string>();
  export let onlyShowSelected = false;

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
    selectedIngredients = selectedIngredients;

    // Store the selected ingredients as a JSON string in local storage
    localStorage.setItem('selectedIngredients', JSON.stringify([...selectedIngredients]));
  }

  function clearSelectedIngredients() {
    clicked = true;
    setTimeout(() => {
      clicked = false;
    }, 175);

    selectedIngredients.clear();
    localStorage.setItem('selectedIngredients', JSON.stringify([]));
  }
  
  onMount(() => {
    localStorage.clear();
    // Get the selected ingredients from local storage and parse the JSON string
    const savedIngredients = localStorage.getItem('selectedIngredients');
    if (savedIngredients) {
      selectedIngredients = JSON.parse(savedIngredients);
    }
  });
</script>

<svelte:head>
	<title>ChefGPT</title>
	<meta name="description" content="ChatGPT-Powered Recipe Tool" />
</svelte:head>

<input type="text" bind:value={searchText} placeholder="Search ingredients...">

<button
  class:clicked={clicked}
  on:click={() => clearSelectedIngredients()}
>
  Clear all
</button>

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
      <img src={ingredient.image} alt={ingredient.name} />
      <p>{ingredient.name.toUpperCase()}</p>
    </div>    
  {/each}
</div>

<h2>{selectedIngredients.size} ingredients selected</h2>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
  }

  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
  }

  p {
    color: var(--color-theme-2);
  }

  h2 {
    width: 100%;
    text-align: center;
  }

  /* Add a different background color when clicked */
  button.clicked {
    background-color: var(--color-theme-1);
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

  .ingredient img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .ingredient:hover img {
    transform: scale(1.1);
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

</style>
