import { writable } from 'svelte/store';
import { vendorService } from '../services/vendor-id-api.service';
import { localStorageSettings } from '../libs/create-subscription-storage';

/**
 * Current application settings and state
 */
export function applicationSettingsData() {
  const defaults: {
    lineEnding: string;
  } = {
    lineEnding: '\n',
  };

  const { subscribe, set, update } = writable(defaults);

  return {
    subscribe,
    set,
    update,
  };
}

/**
 * Connected device status
 */
function connectedDeviceData() {
  const defaults: {
    usbVendorId: number | undefined;
    usbProductId: number | undefined;
    usbVendorName: string;
    usbProductName: string;
  } = {
    usbVendorId: -1,
    usbProductId: -1,
    usbVendorName: 'Unknown',
    usbProductName: 'Unknown',
  };

  const { subscribe, set, update } = writable(defaults);

  return {
    subscribe,
    set,
    update,
    setProduct: (product: SerialPortInfo) =>
      update((state) => ({
        ...state,
        ...product,
        usbVendorName: vendorService.findByVendorId(product.usbVendorId),
      })),
    reset: () => set(defaults),
  };
}

/**
 * The Serial Port settings for creating a connection
 */
export const serialPortSettings = writable({
  baudRate: 9600,
  bufferSize: 255,
  dataBits: 8,
  flowControl: 'none',
  parity: 'none',
  stopBits: 1,
});

export const applicationSettings = applicationSettingsData();
export const connectedDevice = connectedDeviceData();

localStorageSettings.addStore('port-settings', serialPortSettings);
localStorageSettings.addStore('app-settings', applicationSettings);
