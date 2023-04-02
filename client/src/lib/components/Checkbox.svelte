<script lang="ts">
  import Icon from '@iconify/svelte';
  // @ts-ignore
  import uuid from 'uuid-v4'

  type CheckboxIcon = {
    icon: string;
    color: string;
    rotate?: number;
  }
  export let selectedIcon: CheckboxIcon = { 
    icon: 'material-symbols:check-box',
    color: 'var(--color-theme-1)'
  };
  export let unselectedIcon: CheckboxIcon = {
    icon: 'material-symbols:check-box-outline-blank',
    color: 'var(--color-theme-3)'
  };
  export let selected: boolean;
  export let text: string = '';
  export let onClick = () => { selected = !selected };
  
  let color = 'var(--color-theme-3)'
  let icon = 'material-symbols:check-box';
  let rotate: number | undefined = undefined;

  const id = uuid();

  $: (color = selected ? selectedIcon.color : unselectedIcon.color);
  $: (icon = selected ? selectedIcon.icon : unselectedIcon.icon);
  $: (rotate = selected ? selectedIcon.rotate : unselectedIcon.rotate);
</script>

<div
  class="wrapper"
  on:click={onClick}
  on:keyup={(event) => (event.key === ' ' || event.key === 'Enter') && onClick()}
>
  <div class="icon">
    <Icon icon={icon} color={color} rotate={rotate}/>
  </div>
  <input id={id} type="checkbox" checked={selected} value={text} on:input={onClick}/>
  <label for={id}>{text}</label>
</div>

<style>
  .wrapper {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .icon {
    max-height: fit-content;
    height: 16px;
  }

  .wrapper:focus-within > .icon {
    box-shadow: 0 0 3px 0.5px var(--color-theme-1);
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
</style>
