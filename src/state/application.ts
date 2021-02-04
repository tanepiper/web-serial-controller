import { writable } from 'svelte/store';
import { vendorService } from '../services/vendor-id-api.service';

/**
 * Current application settings and state
 */
export const applicationSettings = writable({
  lineEnding: '\n',
  connectionStatus: 'Disconnected',
  availableDevices: 0,
});

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
    usbVendorId: number | undefined,
    usbProductId: number | undefined,
    usbVendorName: string,
    usbProductName: string

  } = {
    usbVendorId: undefined,
    usbProductId: undefined,
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

export const connectedDevice = connectedDeviceData();
