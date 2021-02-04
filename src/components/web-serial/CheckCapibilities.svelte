<script>

  import { createEventDispatcher, onMount } from 'svelte';

  const dispatch = createEventDispatcher();

  export let headerText = 'Guru Meditation Error';
  export let bodyText = `
  <p>A problem has been detected with your browser and you tab has been shut down to prevent further problems.</p>
  <p>This demo requires the <a href='https://wicg.github.io/serial/' style='color: white; text-decoration: underline;'>Web Serial API</a> but it is unsupported by your browser.</p>
  <p>You need Chrome or Blink 89 to use the feature unflagged.</p>
  <p>For for earlier versions to turn on Experimental Web Features in <code>chrome:///flags</code>.</p>
  <p><a href='https://tane.dev' style='color: white; text-decoration: underline;'>tane.dev</a> | <a href='https://github.com/tanepiper/web-serial-controller' style='color: white; text-decoration: underline;'>Source Code</a></a></p>
`;

  export let displayBSOD = false;

  onMount(() => {
    if (!navigator.serial) {
      setTimeout(() => {
        displayBSOD = true;
      }, 1000);

      dispatch('bsod', {
        'canHaz': false
      });
    } else {
      dispatch('bsod', {
        'canHaz': true
      });
    }
  });

</script>

<style type='scss'>

  * {
    margin: 0;
    box-sizing: border-box;
  }

  a {
    color: #fff;
  }

  .bsod {
    font-family: "Lucida Console", "Lucida Sans Typewriter", monaco, "Bitstream Vera Sans Mono", monospace;
    background: rgb(0, 0, 170);
    position: fixed;
    z-index: 9999;
    top: calc(-100%);
    left: 0;
    width: 100%;
    height: 100%;
    color: rgb(255, 255, 255);
  }

  .bsod-content {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 14px;
    max-width: 420px;
    transform: translateX(-50%) translateY(-50%);
  }

  .bsod-header {
    text-align: center;
    margin: 0 auto 10px;

    span {
      background: rgba(255, 255, 255, 0.7);
      color: rgb(0, 0, 170);
    }
  }

  .display {
    transition: 666ms ease-in-out;
    transform: translateY(100%);
  }
</style>

<div class='bsod' class:display={displayBSOD} hidden={!displayBSOD}>
  <div class='bsod-content'>
    <div class='bsod-header'><span>{headerText}</span></div>
    <div class='bsod-body'>{@html bodyText}</div>
  </div>
</div>
