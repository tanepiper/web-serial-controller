<script type="ts">
  import { tap } from 'rxjs/operators';
  import { serialService } from '../services/web-serial.service.ts';
  import { onMount } from 'svelte';
  import EmojiKeyboard from '../components/keyboard/EmojiKeyboard.svelte';

  export let appSettings;

  // Input
  export let currentMessage = '';

  const encoder = new TextEncoder();

  // Output
  let outputEl;
  let textInput;
  const decoder = new TextDecoder('utf-8');

  onMount(() => {
    textInput.focus();
  });

  function appendMessage(message: string, source: string) {
    let prepend;
    if (source === 'user') {
      prepend = `&gt;`;
    } else {
      const now = new Date();
      const time = [now.getHours(), now.getMinutes(), now.getSeconds()]
        .map((value) => (value < 10 ? `0${value}` : `${value}`))
        .join(':');
      prepend = `[${time}]`;
    }
    outputEl.innerHTML += `<code>${prepend} ${message.trim()}</code><br />`;
    outputEl.scrollTo({ top: outputEl.scrollHeight });
  }

  function sendMessage() {
    if (currentMessage !== '') {
      appendMessage(currentMessage, 'user');
      serialService.sendMessage(encoder.encode(`${currentMessage}${appSettings.lineEnding}`));
      currentMessage = '';
      textInput.focus();
    }
  }

  function onEmoji(event: CustomEvent) {
    const { detail } = event;
    currentMessage += detail.emoji;
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      sendMessage();
    }
  }

  let queue = [];

  serialService.stream$
    .pipe(
      tap((value) => {
        const decoded = decoder.decode(value);
        queue.push(decoded);
        if (queue.join('').endsWith(appSettings.lineEnding)) {
          appendMessage(queue.join(''), 'serial');
          queue = [];
        }
      }),
    )
    .subscribe();
</script>

<svelte:window on:keydown={handleKeyDown} />

<pre class="text-output" bind:this={outputEl} />
<div class="window-body">
  <fieldset>
    <legend>Send To Connected Device</legend>

    <div class="form-group">
      <label for="input-text">Enter Text: </label>
      <input id="input-text" type="text" style="min-width: 70%" bind:value={currentMessage} bind:this={textInput} />
      <button on:click={sendMessage}>Send</button>
    </div>
  </fieldset>
  <fieldset>
    <EmojiKeyboard on:emojiChange={onEmoji} />
  </fieldset>
</div>

<style>
  .text-output {
    height: 400px;
    overflow-y: scroll;
  }
</style>
