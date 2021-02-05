import { writable } from 'svelte/store';
import { ApplicationStatus } from '../constants/application';

export interface ConnectionStatus {
  status: ApplicationStatus;
  availableDevices: number;
  isConnected: boolean;
  isConnecting: boolean;
  displayText: string;
  message?: string;
}

function createConnectionStatus() {
  function getDisplayText(value: string) {
    return value
      .split('_')
      .map((part) => {
        return part.charAt(0).toUpperCase() + part.slice(1);
      })
      .join(' ');
  }

  const { subscribe, update } = writable<ConnectionStatus>({
    status: ApplicationStatus.DISCONNECTED,
    availableDevices: 0,
    isConnected: false,
    isConnecting: false,
    displayText: getDisplayText(ApplicationStatus.DISCONNECTED),
    message: undefined,
  });

  return {
    subscribe,
    status: (status: ApplicationStatus, message?: string) => {
      update((state: ConnectionStatus) => ({
        ...state,
        status,
        isConnected: status === ApplicationStatus.CONNECTED,
        isConnecting: [ApplicationStatus.AWAITING_PORT, ApplicationStatus.CONNECTING].includes(status as any),
        displayText: getDisplayText(status),
        message,
      }));
    },
    setDevices: (availableDevices: number) => update((state) => ({ ...state, availableDevices })),
    addDevice: () => update((state) => ({ ...state, availableDevices: state.availableDevices + 1 })),
    removeDevice: () =>
      update((state) => ({
        ...state,
        availableDevices: state.availableDevices === 0 ? 0 : state.availableDevices - 1,
      })),
  };
}

export const connectionStatus = createConnectionStatus();
