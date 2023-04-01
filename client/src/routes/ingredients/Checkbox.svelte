<script lang="ts">
  import Icon from '@iconify/svelte';
  // @ts-ignore
  import uuid from 'uuid-v4'

  export let selected: boolean;
  export let text: string;
  export let onClick = () => { selected = !selected };
  
  let color = 'var(--color-theme-3)'
  let icon = 'material-symbols:check-box';

  const id = uuid();

  $: (color = selected ? 'var(--color-theme-1)' : 'var(--color-theme-3)');
  $: (icon = selected ? 'material-symbols:check-box' : 'material-symbols:check-box-outline-blank');
</script>

<div
  class="wrapper"
  on:click={onClick}
  on:keyup={onClick}
>
  <div class="icon">
    <Icon class="icon" icon={icon} color={color}/>
  </div>
  <input id={id} type="checkbox" checked={selected} value={text}/>
  <label for={id}>{text}</label>
</div>

<style>
  .wrapper {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .icon {
    height: fit-content;
  }

  .wrapper:focus-within > .icon {
    box-shadow: 0 0 5px 1px var(--color-theme-1);
  }

  input {
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  /* Stylize input element of type checkbox */
  input[type=checkbox] {
    /* Hide checkbox visually but remain accessible to screen readers. */
    border: 0;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
</style>
