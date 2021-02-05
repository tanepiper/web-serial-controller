<script lang="ts">
  import 'xp.css/dist/XP.css';
  import './main.scss';
  import WindowContainer from './containers/WindowContainer.svelte';

  import { Tab, TabContainer, TabMenu, TabPanel } from './components/tabs';
  import CheckCapabilities from './components/web-serial/CheckCapibilities.svelte';
  import GlobalKeyboardListener from './components/keyboard/GlobalKeyboardListener.svelte';
  import TaskBar from './components/taskbar/Taskbar.svelte';

  import ConnectToDevice from './views/ConnectToDevice.svelte';
  import SendText from './views/SendText.svelte';
  import AboutApp from './views/AboutApp.svelte';

  import { serialService } from './services/web-serial.service';
  import { vendorService } from './services/vendor-id-api.service';

  export let name: string;
  export let appVersion: string;

  export let connectionStatus;
  export let applicationSettings;
  export let serialPortSettings;
  export let connectedDevice;

  async function onCapability({ detail }: CustomEvent) {
    if (detail.canHaz) {
      vendorService.getVendorList();
      await serialService.setupListeners();
    }
  }

  async function eventTypeHandler({ detail }: CustomEvent, filterDevice: any, options: SerialOptions) {
    const { type } = detail;
    if (type === 'disconnect') {
      serialService.disconnect();
    } else if (type === 'connect') {
      try {
        if (filterDevice) {
          const val = { usbVendorId: parseInt(`0x${parseInt(filterDevice.value, 10)}`).toString(16) };
          await serialService.requestPort({ filters: [val as any] });
        } else {
          await serialService.requestPort();
        }
        serialService.connect(options);
      } catch {}
    }
  }
</script>

<CheckCapabilities on:bsod={onCapability} />
<GlobalKeyboardListener on:keyEvent={(e) => eventTypeHandler(e, $serialPortSettings)} />

<div class="background">
  <div class="wrapper">
    <WindowContainer title={`${name} ${appVersion}`} close={false}>
      <TabContainer>
        <TabMenu>
          <Tab>Information</Tab>
          <Tab>Connect To Device</Tab>
          <Tab disabled={!$connectionStatus.isConnected}>Send To Device</Tab>
        </TabMenu>

        <TabPanel>
          <AboutApp {appVersion} />
        </TabPanel>
        <TabPanel>
          <ConnectToDevice
            on:change={(e) => eventTypeHandler(e, $connectionStatus.filterDevice, $serialPortSettings)}
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
        Available Devices: {$connectionStatus.availableDevices}
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
    <TaskBar
      connectionStatus={$connectionStatus}
      connectedDevice={$connectedDevice}
      on:taskEvent={(e) => eventTypeHandler(e, $connectionStatus.filterDevice, $serialPortSettings)}
    />
  </div>
</div>

<style type="scss">
  .wrapper {
    padding-top: 100px;
  }
</style>
