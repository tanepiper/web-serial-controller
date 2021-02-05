import { writable } from 'svelte/store';
import { ApplicationStatus } from '../constants/application';

function createConnectionStatus() {
  function getDisplayText(value: string) {
    return value
      .split('_')
      .map((part) => {
        return part.charAt(0).toUpperCase() + part.slice(1);
      })
      .join(' ');
  }

  const { subscribe, set } = writable<{
    status: ApplicationStatus;
    isConnected: boolean;
    isConnecting: boolean;
    displayText: string;
    message?: string;
  }>({
    status: ApplicationStatus.DISCONNECTED,
    isConnected: false,
    isConnecting: false,
    displayText: getDisplayText(ApplicationStatus.DISCONNECTED),
    message: undefined,
  });

  return {
    subscribe,
    set: (status: ApplicationStatus, message?: string) => {
      set({
        status,
        isConnected: status === ApplicationStatus.CONNECTED,
        isConnecting: [ApplicationStatus.AWAITING_PORT, ApplicationStatus.CONNECTING].includes(status as any),
        displayText: getDisplayText(status),
        message
      });
    },
  };
}

export const connectionStatus = createConnectionStatus();
