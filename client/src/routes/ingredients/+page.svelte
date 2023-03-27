<script lang="ts">
  import { onMount } from 'svelte';
  // @ts-ignore
  import MultiSelect from 'svelte-multiselect'

  import ingredients from './ingredients';

  let clicked = false;
  let selectedIngredients: string[] = [];
  let searchText = '';
  let selectedCategories: string[] = [];

  $: filteredIngredients = ingredients.filter((ingredient) => {
    return (!selectedCategories.length || selectedCategories.includes(ingredient.category)) && ingredient.name.toLowerCase().includes(searchText.toLowerCase());
  });

  // computed property to get unique categories
  const categories = [...new Set(ingredients.map(ingredient => ingredient.category))];

  function selectIngredient(name: string) {
    if (selectedIngredients.includes(name)) {
      // If the ingredient is already selected, remove it from the array
      selectedIngredients = selectedIngredients.filter((ingredient) => ingredient !== name);
    } else {
      // If the ingredient is not selected, add it to the array
      selectedIngredients = [...selectedIngredients, name];
    }

    // Store the selected ingredients as a JSON string in local storage
    localStorage.setItem('selectedIngredients', JSON.stringify(selectedIngredients));
  }

  function clearSelectedIngredients() {
    clicked = true;
    setTimeout(() => {
      clicked = false;
    }, 175);

    selectedIngredients = [];
    localStorage.setItem('selectedIngredients', JSON.stringify([]));
  }
  
  onMount(() => {
    // Get the selected ingredients from local storage and parse the JSON string
    const savedIngredients = localStorage.getItem('selectedIngredients');
    if (savedIngredients) {
      selectedIngredients = JSON.parse(savedIngredients);
    }
  });
</script>

<input type="text" bind:value={searchText} placeholder="Search ingredients...">

<MultiSelect
  --sms-options-bg="#2F302F"
  options={categories}
  placeholder="All Categories"
  bind:selected={selectedCategories}
/>

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
      class:selected={selectedIngredients.includes(ingredient.name)}
      class="ingredient"
      tabindex="0"
      on:click={() => selectIngredient(ingredient.name)}
      on:keypress={(e) => e.key === 'Enter' && selectIngredient(ingredient.name)}
    >
      <img src={ingredient.image} alt={ingredient.name} />
      <p>{ingredient.name}</p>
    </div>
  {/each}
</div>

<h2>{selectedIngredients.length} ingredients selected</h2>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
  }

  .ingredient {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    background-color: var(--color-theme-3);
  }

  .selected {
    background-color: var(--color-theme-1);
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
</style>
