import App from './App.svelte';

const appVersion = import.meta.env.SNOWPACK_PUBLIC_APP_VERSION;

import { applicationSettings, connectedDevice, serialPortSettings } from './state/application';
import { connectionStatus } from './state/connection-status';

const app = new App({
  target: document.body,
  props: {
    name: 'Web Serial Controller',
    appVersion,
    applicationSettings,
    serialPortSettings,
    connectedDevice,
    connectionStatus,
  },
});

export default app;

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.dispose(() => {
    app.$destroy();
  });
}
