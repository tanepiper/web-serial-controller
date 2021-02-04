<script type='ts'>

  import { serialService } from '../../services/web-serial.service';

  export let portOptions;

  async function handleKeyDown(event: KeyboardEvent) {

    if (event.ctrlKey) {
      if (event.code === 'KeyC') {
        try {
          await serialService.requestPort();
          serialService.connect(portOptions as SerialOptions);
        } catch {
        }
      } else if (event.code === 'KeyD') {
        serialService.disconnect();
      }
    }
  }
</script>


<svelte:window on:keydown={handleKeyDown} />
