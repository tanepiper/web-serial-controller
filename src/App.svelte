<script lang='ts'>
	import 'xp.css/dist/XP.css';
	import './main.css';

	import WindowContainer from './containers/WindowContainer.svelte';
	import { Tab, TabContainer, TabMenu, TabPanel } from './components/tabs';
	import ConnectToDevice from './views/ConnectToDevice.svelte';
	import SendText from './views/SendText.svelte';
	import AboutApp from './views/AboutApp.svelte';
	import CodeExamples from './views/CodeExamples.svelte';
	import CheckCapibilities from './components/web-serial/CheckCapibilities.svelte';

	import GlobalKeyboardListener from './components/keyboard/GlobalKeyboardListener.svelte';

	import { applicationSettings, connectedDevice, serialPortSettings } from './state/application.ts';
	import { serialService } from './services/web-serial.service';
	import { vendorService } from './services/vendor-id-api.service';
	import { ApplicationStatus } from './constants/application';

	export let name: string;

	async function onCapability({ detail }: CustomEvent) {
		if (detail.canHaz) {
			vendorService.getVendorList();
			await serialService.setupListeners();
		}
	}

</script>


<style type='scss'>
	.background {
		background-image: url("/windows-background.jpg");
		height: 100%;
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
	}

	.wrapper {
		padding-top: 100px;
	}

</style>

<CheckCapibilities on:bsod={onCapability} />
<GlobalKeyboardListener bind:portOptions={$serialPortSettings} />

<div class='background'>
	<div class='wrapper'>

		<WindowContainer title={name} close={false} positionX='40px' positionY='100px'>
			<TabContainer>
				<TabMenu>
					<Tab>Information</Tab>
					<Tab>Connect To Device</Tab>
					<Tab disabled={$applicationSettings.connectionStatus !== ApplicationStatus.CONNECTED}>Send Text</Tab>
					<Tab>Code Examples</Tab>
				</TabMenu>

				<TabPanel>
					<AboutApp />
				</TabPanel>
				<TabPanel>
					<ConnectToDevice bind:appSettings={$applicationSettings} bind:portOptions={$serialPortSettings} bind:deviceInfo={$connectedDevice} />
				</TabPanel>
				<TabPanel>
					<SendText bind:appSettings={$applicationSettings}/>
				</TabPanel>
				<TabPanel>
					<CodeExamples />
				</TabPanel>
			</TabContainer>

			<span slot='status1'>
     Available Devices: {$applicationSettings.availableDevices}
    </span>

			<span slot='status2'>
    Connection Status:&nbsp;{$applicationSettings.connectionStatus}
  </span>

			<span slot='status3'>
      {#if $applicationSettings.connectionStatus === ApplicationStatus.CONNECTED}
        Press Ctrl + D to Disconnect
        {:else}
        Press Ctrl + C to Connect
        {/if}
    </span>
		</WindowContainer>
	</div>
</div>
