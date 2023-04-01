<script lang="ts">
  import { categoryGroups } from './ingredients.js';
  import Icon from '@iconify/svelte';
  import Checkbox from './Checkbox.svelte';

  export let selectedCategories = new Set<string>();
  export let change: (newValue: Set<string>) => void;
  export let onlyShowSelected = false;
  export let changeOnlyShowSelected: (newValue: boolean) => void;

  let expandedGroups = new Set<String>();

  function toggleCategoryGroup(categoryGroup: string[]) {
    if (categoryGroup.every(category => selectedCategories.has(category))) {
      categoryGroup.forEach(category => selectedCategories.delete(category));
    } else {
      categoryGroup.forEach(category => selectedCategories.add(category));
    }
    selectedCategories = selectedCategories;
    change(selectedCategories);
  }

  function toggleCategory(category: string) {
    if (selectedCategories.has(category)) {
      selectedCategories.delete(category);
    } else {
      selectedCategories.add(category);
    }
    selectedCategories = selectedCategories;
    change(selectedCategories);
  }

  function toggleGroup(groupName: string) {
    if (expandedGroups.has(groupName)) {
      expandedGroups.delete(groupName);
    } else {
      console.log('adding group');
      expandedGroups.add(groupName);
    }
    expandedGroups = expandedGroups;
  }

  function clearFilters() {
    selectedCategories.clear();
    selectedCategories = selectedCategories;
    change(selectedCategories);
  }

  const caretIconSelected = {
    icon: 'mdi:caret',
    color: 'var(--color-theme-3)',
    rotate: 2,
  };
  const caretIconUnselected = {
    icon: 'mdi:caret',
    color: 'var(--color-theme-3)',
    rotate: 1,
  };
</script>

<div class="sidebar-section">
  <div class="section-header">
    <h2>Filter Ingredient</h2>
  </div>
  <ul>
    <li>
      <Checkbox selected={onlyShowSelected} text="Only Selected" onClick={() => changeOnlyShowSelected(!onlyShowSelected)}/>
    </li>
    {#each Object.entries(categoryGroups) as [groupName, groupCategories]}
      <li>
        <form class="group-header">
          <Checkbox selected={!groupCategories.some(category => !selectedCategories.has(category))} text={groupName} onClick={() => toggleCategoryGroup(groupCategories)}/>
          <Checkbox
            selected={expandedGroups.has(groupName)}
            onClick={() => toggleGroup(groupName)}
            selectedIcon={caretIconSelected}
            unselectedIcon={caretIconUnselected}
          />
        </form>
        {#if expandedGroups.has(groupName)}
          <ul class="categories">
            {#each groupCategories as category}
              <li class="category">
                <Checkbox selected={selectedCategories.has(category)} text={category} onClick={() => toggleCategory(category)}/>
              </li>
            {/each}
          </ul>
        {/if}
      </li>
    {/each}
  </ul>
  {#if selectedCategories.size > 0}
    <button on:click={clearFilters}>Clear Filters</button>
  {/if}
</div>

<style>
  .sidebar-section {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 16px;
    margin-bottom: 16px;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .group-header {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .categories {
    padding-top: 8px;
  }

  .category {
    margin-left: 16px;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    margin-bottom: 8px;
  }
</style>
