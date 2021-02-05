import { writable } from 'svelte/store';
import { vendorService } from '../services/vendor-id-api.service';
import { ApplicationStatus } from '../constants/application';

/**
 * Current application settings and state
 */
export function applicationSettingsData() {
  const defaults: {
    lineEnding: string;
    connectionStatus: ApplicationStatus;
    availableDevices: number;
  } = {
    lineEnding: '\n',
    connectionStatus: ApplicationStatus.DISCONNECTED,
    availableDevices: 0,
  };

  const { subscribe, set, update } = writable(defaults);

  return {
    subscribe,
    set,
    update,
    addDevice: () => update((state) => ({ ...state, availableDevices: state.availableDevices + 1 })),
    removeDevice: () =>
      update((state) => {
        if (state.availableDevices > 0) {
          return { ...state, availableDevices: state.availableDevices - 1 };
        } else {
          return { ...state, availableDevices: 0 };
        }
      }),
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

export const applicationSettings = applicationSettingsData();
export const connectedDevice = connectedDeviceData();
