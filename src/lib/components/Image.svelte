<script lang="ts">
  import { onMount } from 'svelte'

  export let src: string;
  export let alt: string;

  let loaded = false;
  let thisImage: HTMLImageElement;

  onMount(() => {
    thisImage.onload = () => {
      loaded = true
    }
  }) 

</script>

<style>
  img {
    background-color: var(--color-theme-3);
    opacity: 0;
    transition: opacity 500ms ease-out;
    display: block;
    object-fit: cover;
    transition: transform 0.3s ease;
    width: var(--size);
    height: var(--size);
  }
  img.loaded {
    opacity: 1;
  }
  img:hover {
    transform: scale(1.15);
  }
</style>

<img {src} {alt} class:loaded bind:this={thisImage} loading="lazy" />
