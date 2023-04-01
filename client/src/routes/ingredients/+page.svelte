<script lang="ts">
	import '../styles.css';
	import IngredientsSelection from './IngredientsSelection.svelte';

  import Sidebar from './Sidebar.svelte';

  let selectedCategories = new Set<string>();
  let onlyShowSelected = false;

  const handleChange = (newValue: Set<string>) => {
    selectedCategories = newValue;
  }

  const handleOnlySelectedChange = (newValue: boolean) => {
    onlyShowSelected = newValue;
  }
</script>

<div class="ingredients-page">
  <aside>
    <Sidebar selectedCategories={selectedCategories} change={handleChange} onlyShowSelected={onlyShowSelected} changeOnlyShowSelected={handleOnlySelectedChange} />
  </aside>
	<section>
		<IngredientsSelection selectedCategories={selectedCategories} onlyShowSelected={onlyShowSelected} />
	</section>
</div>

<style>
	.ingredients-page {
    display: grid;
    grid-template-columns: 250px 1fr;
    grid-gap: 20px;
    width: 100%;
	}

	section {
    grid-column: 2;

		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}

  aside {
    padding: 20px;
  }

</style>
