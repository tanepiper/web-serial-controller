<script type="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let index = 3;
  const supportedRates = [1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200];

  export let baudRate = 9600;
  export let disabled = false;

  function baudRateChanges(index: number) {
    baudRate = supportedRates[index];
    dispatch('baudRateChange', {
      baudRate,
    });
  }
</script>

<fieldset>
  <legend>Baud Rate Selection</legend>
  <div class="field-row">
    <label for="baudRate">Baud Rate:</label>
    <span>1200</span>
    <input
      class="input-baud-rate"
      id="baudRate"
      type="range"
      min="0"
      max="7"
      name="baudRate"
      bind:value={index}
      on:change={() => baudRateChanges(index)}
      {disabled}
    />
    <span>115200</span>
  </div>
  <div class="window-body">
    Selected: <span class="selected-baud">{baudRate}</span>
  </div>
</fieldset>
