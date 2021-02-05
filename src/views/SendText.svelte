<script type="ts">
    import { tap } from 'rxjs/operators';
    import { serialService } from '../services/web-serial.service.ts';
    import { onMount } from 'svelte';
    import VirtualKeyboard from '../components/keyboard/VirtualKeyboard.svelte';
    import TabContainer from '../components/tabs/TabContainer.svelte';
    import TabMenu from '../components/tabs/TabMenu.svelte';
    import { Tab } from '../components/tabs';
    import TabPanel from '../components/tabs/TabPanel.svelte';
    import { timeString } from "../libs/time";
    import { createTextStream } from '../libs/stream-text'

    let textStream;

    /**
     * Application settings
     */
    export let appSettings;
    /**
     * Optionally set the initial input message
     */
    export let currentMessage = '';

    const hexKeys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'a', 'b', 'c', 'd', 'e', 'f'];
    const emojiKeys = ['😁', '😂', '😍', '🐶', '😺', '🦉', '😎', '😤', '🥳', '💩', '💯', '🥷', '👾', '🤖'];
    let echoLocal = true;
    let echoTimestamp = true;


    // Output
    let outputEl;
    let textInput;


    onMount(() => {
        textStream = createTextStream(appSettings.lineEnding);
        textInput.focus();
    });

    function appendMessage(message: string, source: string) {

        if (source === 'user' && !echoLocal) {
            return;
        }
        const prepend = echoTimestamp ? `[${timeString(true)}]` : `&gt;`;
        const appendEl = document.createDocumentFragment();
        const codeEl = document.createElement('code');
        codeEl.innerHTML = `${prepend} ${message.trim()}`;
        if (source === 'user') {
            codeEl.style.color = 'lightgreen';
        }
        appendEl.appendChild(codeEl);
        appendEl.appendChild(document.createElement('br'));
        outputEl.appendChild(appendEl);
        outputEl.scrollTo({top: outputEl.scrollHeight});
    }

    function sendMessage() {
        if (currentMessage !== '') {
            appendMessage(currentMessage, 'user');
            serialService.sendMessage(textStream.encode(`${currentMessage}${appSettings.lineEnding}`));
            currentMessage = '';
            textInput.focus();
        }
    }

    function appendToInput({detail}: CustomEvent) {
        currentMessage += detail.key;
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (event.code === 'Enter') {
            sendMessage();
        }
    }

    serialService.stream$
        .pipe(tap((value) => textStream.decode(value, (output) => appendMessage(output, 'serial'))))
        .subscribe();
</script>

<svelte:window on:keydown={handleKeyDown}/>

<pre class="text-output" bind:this={outputEl}/>
<div class="window-body">
    <fieldset>
        <legend>Send To Connected Device</legend>

        <div class="form-group">
            <label for="input-text">Input:&nbsp;</label>
            <input id="input-text" type="text" style="min-width: 70%" bind:value={currentMessage} bind:this={textInput}
                   placeholder="Enter a string value to send to the connected device"/>
            <button on:click={sendMessage}>Send</button>
        </div>
        <br/>
        <div class="form-group">
            <input type="checkbox" id="local-echo" bind:checked={echoLocal}/>
            <label for="local-echo">Echo Input</label>
            &nbsp;
            <input type="checkbox" id="timestamp" bind:checked={echoTimestamp}/>
            <label for="timestamp">Show Timestamp</label>
        </div>
    </fieldset>
    <TabContainer>
        <TabMenu>
            <Tab>Hex Keyboard</Tab>
            <Tab>Emoji Keyboard</Tab>
        </TabMenu>

        <TabPanel>
            <VirtualKeyboard keyboardName="Hex" keyValues={hexKeys} on:keyPress={appendToInput}/>
        </TabPanel>
        <TabPanel>
            <VirtualKeyboard keyboardName="Emoji" keyValues={emojiKeys} on:keyPress={appendToInput}/>
        </TabPanel>
    </TabContainer>
</div>

<style>
    .text-output {
        height: 400px;
        overflow-y: scroll;
    }

    #input-text {
        border-bottom: 1px solid lightgray;
    }
</style>
