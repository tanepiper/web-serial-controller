<script type="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { IMAGES } from '../../constants/images';
  import { getOffset } from '../../libs/dom';
  import { timeString } from '../../libs/time';

  const dispatcher = createEventDispatcher();

  export let connectionStatus;

  let showMenu = false;
  let clock: HTMLDivElement;
  let eject: HTMLImageElement;
  let menu: HTMLDivElement;

  $: time = '';
  let position;

  function disconnectHandler() {
    dispatcher('taskEvent', {
      type: 'disconnect',
    });
    showMenu = false;
  }

  onMount(() => {
    const timer = setInterval(() => (time = timeString()), 1000);

    eject.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (!showMenu) {
        position = `top: ${getOffset(eject).top - (menu.clientHeight - 10)}px; left: ${
          getOffset(eject).left - menu.clientWidth
        }px`;
      }
      showMenu = !showMenu;
    });
    () => clearInterval(timer);
  });
</script>

<div class="taskbar">
  <div class="main-section" />
  <div class="quick-section">
    <img
      class="eject"
      src={IMAGES.eject}
      alt="Connected Device"
      bind:this={eject}
      class:hidden={!connectionStatus.isConnected}
    />

    <div class="clock" bind:this={clock}>{time}</div>
  </div>
</div>

<div class="menu" class:hidden={!showMenu} style={position} bind:this={menu} on:click={disconnectHandler}>
  Eject Device
</div>

<style type="scss">
  :root {
    --dark-color: #245edb;
    --light-color: #0c8dea;
  }

  .hidden {
    visibility: hidden;
  }

  .menu {
    position: absolute;
    width: 120px;
    height: 20px;
    z-index: 200;
    padding: 5px 0 0 5px;
    background: linear-gradient(180deg, #ece9d8, #f4f3ee);
    cursor: pointer;
  }

  .taskbar {
    position: absolute;
    display: flex;
    z-index: 100;
    bottom: 0;
    left: 0;
    width: 100%;

    .main-section,
    .quick-section {
      flex-grow: 1;
    }

    .main-section {
      height: 40px;
      background: linear-gradient(
          to bottom,
          var(--dark-color) 0%,
          #3f8cf3 9%,
          var(--dark-color) 18%,
          #3f8cf3 92%,
          #333 100%
        )
        center/cover no-repeat;
    }

    .quick-section {
      width: 100px;
      height: 38px;
      position: absolute;
      bottom: 0;
      right: 0;
      text-align: right;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      border-top: 2px solid var(--dark-color);
      border-left: 2px solid rgba(0, 0, 0, 0.3);
      background: linear-gradient(to bottom, #3f8cf3 0%, var(--light-color) 18%, var(--dark-color) 92%, #333 100%)
        center/cover no-repeat;

      img {
        width: 24px;
        height: 24px;
        padding-top: 10px;
      }
    }

    .clock {
      color: #fff;
      padding-top: 15px;
      padding-right: 20px;
    }
  }
</style>
