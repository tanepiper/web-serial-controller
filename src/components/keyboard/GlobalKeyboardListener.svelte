<script type="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatcher = createEventDispatcher();

  function dispatch(typeName: string) {
    dispatcher('keyEvent', {
      type: typeName,
    });
  }

  async function handleKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey) {
      if (event.code === 'KeyC') {
        dispatch('connect');
      } else if (event.code === 'KeyD') {
        dispatch('disconnect');
      }
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />
