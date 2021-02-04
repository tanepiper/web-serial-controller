<script>
  import { getContext } from 'svelte';
  import { TABS } from './TabContainer.svelte';

  const tab = {};
  const { registerTab, selectTab, selectedTab } = getContext(TABS);

  export let disabled = false

  registerTab(tab);
</script>

<style type='scss'>
  button[disabled] {
    color: dimgray;

    &:hover {
      border-top: none;
      box-shadow: none;
    }
    &:focus {
      outline: none;
      outline-offset: 0;
    }
  }
</style>

<button role='tab' disabled={disabled} aria-selected="{$selectedTab === tab}" on:click="{() => selectTab(tab)}">
  <slot></slot>
</button>
