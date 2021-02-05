<script type="ts">
    import { tap } from 'rxjs/operators';
    import { serialService } from '../services/web-serial.service.ts';
    import { onMount } from 'svelte';
    import VirtualKeyboard from "../components/keyboard/VirtualKeyboard.svelte";
    import TabContainer from "../components/tabs/TabContainer.svelte";
    import TabMenu from "../components/tabs/TabMenu.svelte";
    import { Tab } from "../components/tabs";
    import TabPanel from "../components/tabs/TabPanel.svelte";

    export let appSettings;

    // Input
    export let currentMessage = '';

    const hexKeys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'a', 'b', 'c', 'd', 'e', 'f'];
    const emojiKeys = ['😁', '😂', '😍', '🐶', '😺', '🦉', '😎', '😤', '🥳', '💩', '💯', '🥷', '👾', '🤖'];

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
        outputEl.scrollTo({top: outputEl.scrollHeight});
    }

    function sendMessage() {
        if (currentMessage !== '') {
            appendMessage(currentMessage, 'user');
            serialService.sendMessage(encoder.encode(`${currentMessage}${appSettings.lineEnding}`));
            currentMessage = '';
            textInput.focus();
        }
    }

    function onKeyChange(event: CustomEvent) {
        const {detail} = event;
        currentMessage += detail.key;
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

<svelte:window on:keydown={handleKeyDown}/>

<pre class="text-output" bind:this={outputEl}/>
<div class="window-body">
    <fieldset>
        <legend>Send To Connected Device</legend>

        <div class="form-group">
            <label for="input-text">Enter Text: </label>
            <input id="input-text" type="text" style="min-width: 70%" bind:value={currentMessage}
                   bind:this={textInput}/>
            <button on:click={sendMessage}>Send</button>
        </div>
    </fieldset>
    <TabContainer>
        <TabMenu>
            <Tab>Hex Keyboard</Tab>
            <Tab>Emoji Keyboard</Tab>
        </TabMenu>

        <TabPanel>
            <VirtualKeyboard keyboardName="Hex" keyValues={hexKeys} on:keyPress={onKeyChange}/>
        </TabPanel>
        <TabPanel>
            <VirtualKeyboard keyboardName="Emoji" keyValues={emojiKeys} on:keyPress={onKeyChange}/>
        </TabPanel>
    </TabContainer>


</div>

<style>
    .text-output {
        height: 400px;
        overflow-y: scroll;
    }
</style>
