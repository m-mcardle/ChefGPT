<script lang="ts">
  export let src: string;
  export let alt: string;

  import { onMount } from 'svelte'

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
    opacity: 0;
    transition: opacity 500ms ease-out;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  img.loaded {
    opacity: 1;
  }
  img:hover {
    transform: scale(1.15);
  }
</style>

<img {src} {alt} class:loaded bind:this={thisImage} loading="lazy" />
