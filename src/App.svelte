<script lang="ts">
  import 'xp.css/dist/XP.css';
  import './main.scss';
  import WindowContainer from './containers/WindowContainer.svelte';
  import { Tab, TabContainer, TabMenu, TabPanel } from './components/tabs';

  import TaskBar from './components/taskbar/Taskbar.svelte';

  import ConnectToDevice from './views/ConnectToDevice.svelte';
  import SendText from './views/SendText.svelte';
  import AboutApp from './views/AboutApp.svelte';

  import CheckCapibilities from './components/web-serial/CheckCapibilities.svelte';

  import GlobalKeyboardListener from './components/keyboard/GlobalKeyboardListener.svelte';

  import { applicationSettings, connectedDevice, serialPortSettings } from './state/application.ts';
  import { serialService } from './services/web-serial.service';
  import { vendorService } from './services/vendor-id-api.service';
  import { connectionStatus } from './state/connection-status';

  const backgroundImage = '/windows-background.jpg';

  export let name: string;
  let portOptions;

  serialPortSettings.subscribe((options) => {
    portOptions = options;
  });

  async function onCapability({ detail }: CustomEvent) {
    if (detail.canHaz) {
      vendorService.getVendorList();
      await serialService.setupListeners();
    }
  }

  async function eventTypeHandler({ detail }: CustomEvent) {
    const { type } = detail;
    if (type === 'disconnect') {
      serialService.disconnect();
    } else if (type === 'connect') {
      try {
        await serialService.requestPort();
        serialService.connect(portOptions);
      } catch {}
    }
  }
</script>

<CheckCapibilities on:bsod={onCapability} />
<GlobalKeyboardListener on:keyEvent={eventTypeHandler} />

<div class="background" style="background-image: url('{backgroundImage}')">
  <div class="wrapper">
    <WindowContainer title={name} close={false} positionX="40px" positionY="100px">
      <TabContainer>
        <TabMenu>
          <Tab>Information</Tab>
          <Tab>Connect To Device</Tab>
          <Tab disabled={!$connectionStatus.isConnected}>Send Text</Tab>
        </TabMenu>

        <TabPanel>
          <AboutApp />
        </TabPanel>
        <TabPanel>
          <ConnectToDevice
            on:change={eventTypeHandler}
            connectionStatus={$connectionStatus}
            deviceInfo={$connectedDevice}
            bind:appSettings={$applicationSettings}
            bind:portOptions={$serialPortSettings}
          />
        </TabPanel>
        <TabPanel>
          <SendText bind:appSettings={$applicationSettings} />
        </TabPanel>
      </TabContainer>

      <span slot="status1">
        Available Devices: {$applicationSettings.availableDevices}
      </span>

      <span slot="status2">
        Connection Status:&nbsp;{$connectionStatus.displayText}
      </span>

      <span slot="status3">
        {#if $connectionStatus.isConnected}
          Press Ctrl + D to Disconnect
        {:else}
          Press Ctrl + C to Connect
        {/if}
      </span>
    </WindowContainer>
    <TaskBar connectionStatus={$connectionStatus} on:taskEvent={eventTypeHandler} />
  </div>
</div>

<style type="scss">
  .background {
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .wrapper {
    padding-top: 100px;
  }
</style>
