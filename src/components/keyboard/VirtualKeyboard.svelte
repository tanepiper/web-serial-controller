<script type="ts">
  import { createEventDispatcher } from 'svelte';
  import WindowContainer from '../../containers/WindowContainer.svelte';

  const dispatch = createEventDispatcher();

  export let keyboardName = 'Virtual Keyboard';
  export let keyValues: Array<string | number> = [];

  let displayHelp = false;

  /**
   * When a button or key is pressed, emit the emoji for that passed index
   * @param index
   */
  function onKeyPress(index: number) {
    dispatch('keyPress', {
      key: keyValues[index],
    });
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey) {
      if (event.code.includes('Digit')) {
        onKeyPress(parseInt(event.key));
      }
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<fieldset>
  <legend
    >{keyboardName} Keyboard
    <span class="help" on:click={() => (displayHelp = !displayHelp)}><strong>(?)</strong></span>
  </legend>
  {#each keyValues as key, i}
    <button class="key-button" on:click={() => onKeyPress(i)}>
      {key}
    </button>
  {/each}
</fieldset>

<WindowContainer
  title="{keyboardName} Help"
  isModal={true}
  isDraggable={true}
  bind:display={displayHelp}
  showStatusBar={false}
  maximize={false}
  minimize={false}
  width="320px"
  height="140px"
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
