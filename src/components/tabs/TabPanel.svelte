<script>
  import { getContext } from 'svelte';
  import { TABS } from './TabContainer.svelte';

  const panel = {};
  const { registerPanel, selectedPanel } = getContext(TABS);

  registerPanel(panel);
</script>

{#if $selectedPanel === panel}
  <article role='tabpanel'>
    <slot></slot>
  </article>
{/if}
