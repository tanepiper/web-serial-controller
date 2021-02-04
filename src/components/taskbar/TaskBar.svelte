<script type="ts">
  import { onDestroy } from 'svelte';
  import { applicationSettings } from '../../state/application';
  import { ApplicationStatus } from '../../constants/application';

  export let height = '40';

  let clock;
  let time = '';

  const timer = setInterval(() => {
    const date = new Date();
    const hour = date.getHours();
    const min = date.getMinutes();
    time = [hour < 10 ? `0${hour}` : hour, min < 10 ? `0${min}` : min].join(':');
  }, 1000);

  onDestroy(() => {
    clearInterval(timer);
  });
</script>

<div class="taskbar">
  <div class="main-section" />
  <div class="quick-section">
    {#if $applicationSettings.connectionStatus === ApplicationStatus.CONNECTED}
      <img src="/player_eject.png" alt="Connected Device" />
    {/if}
    <div class="clock" bind:this={clock}>{time}</div>
  </div>
</div>

<style type="scss">
  :root {
    --dark-color: #245edb;
    --light-color: #0c8dea;
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
      height: 40px;
      flex-grow: 1;
      background: linear-gradient(
          to bottom,
          var(--dark-color) 0%,
          #3f8cf3 9%,
          var(--dark-color) 18%,
          var(--dark-color) 92%,
          #333 100%
        )
        center/cover no-repeat;
    }

    .quick-section {
      width: 100px;
      position: absolute;
      bottom: 0;
      right: 0;
      text-align: right;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;

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
