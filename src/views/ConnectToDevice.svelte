<script type="ts">
  import BaudRate from '../components/web-serial/BaudRate.svelte';
  import { LineEndings } from '../constants/application';

  import { createEventDispatcher } from '../libs/event-dispatcher';

  const dispatcher = createEventDispatcher();

  export let portOptions;
  export let deviceInfo;

  export let connectionStatus;
  export let appSettings;

  async function toggleConnection() {
    if (connectionStatus.isConnecting) {
      return;
    }
    dispatcher.dispatch('change', { type: connectionStatus.isConnected ? 'disconnect' : 'connect' });
  }
</script>

<div class="window-body">
  <div class="connection-status">
    <div>
      <strong>Connection Status:</strong>&nbsp;<span class="status">{connectionStatus.displayText}</span>
      <br /><strong>Vendor ID:</strong>&nbsp;<span>{deviceInfo.usbVendorName} [{deviceInfo.usbVendorId}]</span>
      <br /><strong>Product ID:</strong>&nbsp;<span>{deviceInfo.usbProductName} [{deviceInfo.usbProductId}]</span>
    </div>
    <div>
      <button disabled={connectionStatus.isConnecting} on:click={toggleConnection}>
        {#if connectionStatus.isConnected}
          Disconnect From Device
        {:else}
          Connect To Device
        {/if}
      </button>
    </div>
  </div>
</div>

<BaudRate bind:baudRate={portOptions.baudRate} disabled={connectionStatus.isConnected} />

<fieldset>
  <legend>Hardware</legend>
  <div class="field-row">
    <label for="parity">Parity</label>
    <select id="parity" name="parity" bind:value={portOptions.parity} disabled={connectionStatus.isConnected}>
      <option value="none">None</option>
      <option value="even">Even</option>
      <option value="odd">Odd</option>
    </select>

    <label for="flowControl">Flow Control</label>
    <select
      id="flowControl"
      name="flowControl"
      bind:value={portOptions.flowControl}
      disabled={connectionStatus.isConnected}
    >
      <option value="none">None</option>
      <option value="hardware">Hardware</option>
    </select>

    <label for="bufferSize">Buffer Size</label>
    <input
      type="number"
      id="bufferSize"
      name="bufferSize"
      bind:value={portOptions.bufferSize}
      disabled={connectionStatus.isConnected}
    />
  </div>
</fieldset>

<div class="bit-types">
  <fieldset>
    <legend>Data Bits</legend>

    <div class="field-row">
      <input
        id="databits8"
        type="radio"
        name="dataBits"
        value={8}
        bind:group={portOptions.dataBits}
        disabled={connectionStatus.isConnected}
      />
      <label for="databits8">8</label>
    </div>
    <div class="field-row">
      <input
        id="databits7"
        type="radio"
        name="dataBits"
        value={7}
        bind:group={portOptions.dataBits}
        disabled={connectionStatus.isConnected}
      />
      <label for="databits7">7</label>
    </div>
  </fieldset>

  <fieldset>
    <legend>Stop Bits</legend>

    <div class="field-row">
      <input
        id="stopBits1"
        type="radio"
        name="stopBits"
        value={1}
        bind:group={portOptions.stopBits}
        disabled={connectionStatus.isConnected}
      />
      <label for="stopBits1">1</label>
    </div>
    <div class="field-row">
      <input
        id="stopBits2"
        type="radio"
        name="stopBits"
        value={2}
        bind:group={portOptions.stopBits}
        disabled={connectionStatus.isConnected}
      />
      <label for="stopBits2">2</label>
    </div>
  </fieldset>
</div>

<fieldset>
  <legend>Line Ending</legend>
  <div class="field-row">
    <label for="lineEnding">End Character</label>
    <select
      id="lineEnding"
      name="flowControl"
      bind:value={appSettings.lineEnding}
      disabled={connectionStatus.isConnected}
    >
      <option value={LineEndings.NONE}>None</option>
      <option value={LineEndings.NEW_LINE}>New Line</option>
      <option value={LineEndings.CARRIAGE_RETURN}>Carriage Return</option>
      <option value={LineEndings.BOTH}>Both</option>
    </select>
  </div>
</fieldset>

<style type="scss">
  .connection-status,
  .bit-types {
    display: flex;
    flex-direction: row;
  }

  div,
  fieldset {
    flex: 1;
  }
</style>
