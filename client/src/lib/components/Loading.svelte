<!-- Loading.svelte -->
<script>
  export let size = 64;
  export let color = "#0072C6";
</script>

<div>
  <div
    class="loading"
    style="
      --color: {color};
      --size: {size}px;
    "
  />
</div>

<style>
  .loading {
    display: inline-block;
    width: var(--size);
    height: var(--size);
    position: relative;
    border-radius: 50%;
    box-sizing: border-box;
    border: 3px solid var(--color);
    border-top-color: transparent;
    animation: loading-rotate 1.5s linear infinite;
  }

  @keyframes loading-rotate {
    10% { transform: rotate(15deg); }
    50% { transform: rotate(90deg); }
    80% { transform: rotate(270deg); }
    100% { transform: rotate(360deg); }
  }
</style>
