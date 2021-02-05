<script type="ts">
    import { onMount, createEventDispatcher } from 'svelte';

    const dispatcher = createEventDispatcher();

    function getOffset(el) {
        let _x = 0;
        let _y = 0;
        while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        return {top: _y, left: _x};
    }

    const ejectImage = '/player_eject.png';
    export let height = '40';
    export let connectionStatus;
    let showMenu = false;

    let clock: HTMLDivElement;
    let eject: HTMLImageElement;
    let menu: HTMLDivElement;

    $: time = '';
    let position;

    function disconnectHandler() {
        dispatcher('taskEvent', {
            type: 'disconnect'
        });
        showMenu = false;
    }

    onMount(() => {
        const timer = setInterval(() => {
            const date = new Date();
            const hour = date.getHours();
            const min = date.getMinutes();
            time = [hour < 10 ? `0${hour}` : hour, min < 10 ? `0${min}` : min].join(':');
        }, 1000);

        eject.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (showMenu) {
                showMenu = false
            } else {
                position = `top: ${getOffset(eject).top - (menu.clientHeight - 10)}px; left: ${getOffset(eject).left - menu.clientWidth}px`
                showMenu = true
            }

        });

        () => {
            clearInterval(timer);
        };
    });
</script>

<div class="taskbar">
    <div class="main-section"/>
    <div class="quick-section">

        <img class="eject" src={ejectImage} alt="Connected Device" bind:this={eject}
             class:hidden={!connectionStatus.isConnected}/>

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
    background: linear-gradient(180deg, #fcfcfe, #f4f3ee);
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
      height: 40px;
      flex-grow: 1;
      background: linear-gradient(
                      to bottom,
                      var(--dark-color) 0%,
                      #3f8cf3 9%,
                      var(--dark-color) 18%,
                      var(--dark-color) 92%,
                      #333 100%
      ) center/cover no-repeat;
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
