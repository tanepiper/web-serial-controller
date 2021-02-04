<script type="ts">
  import { createEventDispatcher } from 'svelte';
  import WindowContainer from '../../containers/WindowContainer.svelte';

  const dispatch = createEventDispatcher();

  /**
   * List of Emoji symbols to add to the Emoji Keyboard
   */
  export let emojiSymbols = ['😁', '😂', '😍', '🐶', '😺', '🦉', '😎', '😤', '🥳', '💩', '💯', '🥷'];

  let displayHelp = false;

  /**
   * When a button or key is pressed, emit the emoji for that passed index
   * @param index
   */
  function onEmoji(index: number) {
    dispatch('emojiChange', {
      emoji: emojiSymbols[index],
    });
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey) {
      if (event.code.includes('Digit')) {
        onEmoji(parseInt(event.key));
      }
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<fieldset>
  <legend
    >Emoji Keyboard <span class="help" on:click={() => (displayHelp = !displayHelp)}><strong>(?)</strong></span>
  </legend>
  {#each emojiSymbols as emoji, i}
    <button class="emoji-button" on:click={() => onEmoji(i)}>
      {emoji}
    </button>
  {/each}
</fieldset>

<WindowContainer
  title="Emoji Keyboard Help"
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
    To use the Emoji keyboard, click on the buttons to append to the text box, or use the keyboard keys
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
