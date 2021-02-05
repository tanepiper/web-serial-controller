<script type="ts">
  import { onMount } from 'svelte';
  import { createEventDispatcher } from '../../libs/event-dispatcher';
  import WindowContainer from '../../containers/WindowContainer.svelte';

  const dispatcher = createEventDispatcher();

  export let keyboardName = 'Virtual Keyboard';
  export let keyValues: Array<string | number> = [];

  let displayHelp = false;
  let positionX;
  let positionY;

  function handleKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey) {
      if (event.code.includes('Digit')) {
        dispatcher.dispatch('keyPress', { key: keyValues[parseInt(event.key)] });
      }
    }
  }

  onMount(() => {
    positionX = window.innerWidth / 2;
    positionY = window.innerHeight / 2;
  });
</script>

<svelte:window on:keydown={handleKeyDown} />

<fieldset>
  <legend
    >{keyboardName} Keyboard
    <span class="help" on:click={() => (displayHelp = !displayHelp)}><strong>(?)</strong></span>
  </legend>
  {#each keyValues as key, i}
    <button class="key-button" on:click={() => dispatcher.dispatch('keyPress', { key: keyValues[i] })}>
      {key}
    </button>
  {/each}
</fieldset>

<WindowContainer
  title="{keyboardName} Help"
  isDraggable={true}
  bind:display={displayHelp}
  showStatusBar={false}
  maximize={false}
  minimize={false}
  width="320px"
  height="140px"
  {positionX}
  {positionY}
>
  <div class="window-body">
    To use the {keyboardName} keyboard, click on the buttons to append to the text box, or use the keyboard keys
    <strong>Ctrl</strong> and numbers 0-9
  </div>
  <section class="field-row" style="justify-content: flex-end">
    <button on:click={() => (displayHelp = !displayHelp)}>Close</button>
  </section>
</WindowContainer>

<style type="sass">
  .help
    cursor: pointer
</style>
