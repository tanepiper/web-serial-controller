<script type='ts'>
  import BaudRate from '../components/web-serial/BaudRate.svelte';
  import { serialService } from '../services/web-serial.service.ts';
  import { ApplicationStatus, LineEndings } from '../constants/application';

  import { applicationSettings, serialPortSettings } from '../state/application';

  let disableInput = false;

  export let portOptions;
  export let appSettings;
  export let deviceInfo;

  const disableStates = [ApplicationStatus.AWAITING_PORT, ApplicationStatus.CONNECTING];

  async function toggleConnection() {
    if (disableInput) {
      return;
    }
    if (appSettings.connectionStatus == ApplicationStatus.CONNECTED) {
      serialService.disconnect();
    } else {
      try {
        await serialService.requestPort();

        serialService.connect(portOptions);
      } catch {
      }
    }
  }

  applicationSettings.subscribe(({ connectionStatus }) => {
    disableInput = disableStates.includes(connectionStatus as any);
  });


</script>

<style type='scss'>
  .connection-status, .bit-types {
    display: flex;
    flex-direction: row;
  }

  div, fieldset {
    flex: 1;
  }
</style>

<div class='window-body'>
  <div class='connection-status'>

    <div>
      <strong>Connection Status:</strong>&nbsp;<span class='status'>{appSettings.connectionStatus}</span>
      {#if deviceInfo.usbVendorId}
        <br /><strong>Vendor ID:</strong>&nbsp;<span>{ deviceInfo.usbVendorName } [{deviceInfo.usbVendorId}]</span>
      {/if}
      {#if deviceInfo.usbProductId}
        <br /><strong>Product ID:</strong>&nbsp;<span>{ deviceInfo.usbProductName } [{deviceInfo.usbProductId}]</span>
      {/if}
    </div>
    <div>
      <button disabled={disableInput} on:click={toggleConnection}>
        {#if appSettings.connectionStatus === ApplicationStatus.CONNECTED}
          Disconnect From Device
        {:else}
          Connect To Device
        {/if}
      </button>
    </div>
  </div>
</div>

<BaudRate bind:baudRate={$serialPortSettings.baudRate}
          disabled={ appSettings.connectionStatus === ApplicationStatus.CONNECTED} />

<fieldset>
  <legend>Hardware</legend>
  <div class='field-row'>
    <label for='parity'>Parity</label>
    <select id='parity' name='parity' bind:value={$serialPortSettings.parity}
            disabled={ appSettings.connectionStatus === ApplicationStatus.CONNECTED}>
      <option value='none'>None</option>
      <option value='even'>Even</option>
      <option value='odd'>Odd</option>
    </select>

    <label for='flowControl'>Flow Control</label>
    <select id='flowControl' name='flowControl' bind:value={$serialPortSettings.flowControl}
            disabled={ appSettings.connectionStatus === ApplicationStatus.CONNECTED}
    >
      <option value='none'>None</option>
      <option value='hardware'>Hardware</option>
    </select>

    <label for='bufferSize'>Buffer Size</label>
    <input type='number' id='bufferSize' name='bufferSize' bind:value={$serialPortSettings.bufferSize}
           disabled={ appSettings.connectionStatus === ApplicationStatus.CONNECTED}
    />
  </div>
</fieldset>

<div class='bit-types'>
  <fieldset>
    <legend>Data Bits</legend>

    <div class='field-row'>
      <input
        id='databits8'
        type='radio'
        name='dataBits'
        value={8}
        bind:group={$serialPortSettings.dataBits}
        disabled={ appSettings.connectionStatus === ApplicationStatus.CONNECTED}
      />
      <label for='databits8'>8</label>
    </div>
    <div class='field-row'>
      <input
        id='databits7'
        type='radio'
        name='dataBits'
        value={7}
        bind:group={$serialPortSettings.dataBits}
        disabled={ appSettings.connectionStatus === ApplicationStatus.CONNECTED}

      />
      <label for='databits7'>7</label>
    </div>
  </fieldset>

  <fieldset>
    <legend>Stop Bits</legend>

    <div class='field-row'>
      <input
        id='stopBits1'
        type='radio'
        name='stopBits'
        value={1}
        bind:group={$serialPortSettings.stopBits}
        disabled={ appSettings.connectionStatus === ApplicationStatus.CONNECTED}

      />
      <label for='stopBits1'>1</label>
    </div>
    <div class='field-row'>
      <input
        id='stopBits2'
        type='radio'
        name='stopBits'
        value={2}
        bind:group={$serialPortSettings.stopBits}
        disabled={ appSettings.connectionStatus === ApplicationStatus.CONNECTED}
      />
      <label for='stopBits2'>2</label>
    </div>
  </fieldset>
</div>

<fieldset>
  <legend>Line Ending</legend>
  <div class='field-row'>
    <label for='lineEnding'>End Character</label>
    <select id='lineEnding' name='flowControl' bind:value={appSettings.lineEnding}
            disabled={ appSettings.connectionStatus === ApplicationStatus.CONNECTED}>
      <option value={LineEndings.NONE}>None</option>
      <option value={LineEndings.NEW_LINE}>New Line</option>
      <option value={LineEndings.CARRIAGE_RETURN}>Carriage Return</option>
      <option value={LineEndings.BOTH}>Both</option>
    </select>
  </div>
</fieldset>
