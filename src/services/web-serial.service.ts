import { fromWebSerial, tapOnFirstEmit } from '@rxjs-ninja/rxjs-utility';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import { applicationSettings, connectedDevice } from '../state/application';
import { ApplicationStatus } from '../constants/application';
import {connectionStatus} from '../state/connection-status'

export interface SerialPortInfo {
  usbVendorId: number;
  usbProductId: number;
}

export type SerialStatus =
  | 'disconnected'
  | 'awaiting port'
  | 'connecting'
  | 'connected'
  | 'user cancelled'
  | 'error'
  | string;

export class WebSerialService {
  /**
   * Static instance to ensire this is a singleton
   */
  static _instance: WebSerialService;

  /**
   * Internal instance of the serial port
   */
  private port: SerialPort | undefined;

  /**
   * Store the current device info
   * @private
   */
  private deviceInfoValue$ = new Subject<SerialPortInfo>();

  /**
   * The boolean connection state
   * @private
   */
  private connectedValue$ = new BehaviorSubject<boolean>(false);

  /**
   * Internal connection status
   * @private
   */
  private statusValue$ = new BehaviorSubject<SerialStatus>('disconnected');

  /**
   * Internal writer to the port
   * @private
   */
  private writer$ = new Subject<Uint8Array>();

  /**
   * External output to the port
   * @private
   */
  private output$ = new Subject<Uint8Array>();

  /**
   * Controller to stop the stream
   * @private
   */
  private stopCtrl: AbortController | undefined;

  /**
   * Observable of the stream content
   */
  public get stream$(): Observable<Uint8Array> {
    return this.output$.asObservable();
  }

  /**
   * Device Info
   */
  public get deviceInfo$(): Observable<SerialPortInfo> {
    return this.deviceInfoValue$.asObservable();
  }

  /**
   * Static property to get if there is a open connection
   */
  public isConnected = false;

  /**
   * Line ending for use with sending messages
   */
  public lineEnding = `\n`;

  constructor() {
    if (WebSerialService._instance) {
      return WebSerialService._instance;
    }
    WebSerialService._instance = this;
    connectionStatus.set(ApplicationStatus.DISCONNECTED)
    applicationSettings.update((state) => ({
      ...state,
      connectionStatus: ApplicationStatus.DISCONNECTED,
    }));
  }

  public setupListeners() {
    document.addEventListener('DOMContentLoaded', async () => {
      let ports = await navigator.serial.getPorts();
      applicationSettings.update((state) => ({
        ...state,
        availableDevices: ports.length,
      }));
    });

    navigator.serial.addEventListener('connect', (e) => {
      applicationSettings.addDevice();
    });

    navigator.serial.addEventListener('disconnect', (e) => {
      applicationSettings.removeDevice();
    });
  }

  /**
   * Request a port connection, this can only be called after a user interaction
   * such as a click and will set the current instance port
   *
   * If there is already a port open, it will close the existing port first
   * @param options Options for requesting the port
   */
  async requestPort(options?: SerialPortRequestOptions) {
    if (this.stopCtrl && !this.stopCtrl.signal.aborted) {
      this.disconnect();
    }
    connectionStatus.set(ApplicationStatus.AWAITING_PORT)
    applicationSettings.update((state) => ({
      ...state,
      connectionStatus: ApplicationStatus.AWAITING_PORT,
    }));

    try {
      this.port = await navigator.serial.requestPort(options);
      connectedDevice.setProduct(this.port.getInfo());
    } catch (e) {
      connectionStatus.set(ApplicationStatus.USER_CANCELLED)
      applicationSettings.update((state) => ({
        ...state,
        connectionStatus: ApplicationStatus.USER_CANCELLED,
      }));
      throw e;
    }
  }

  /**
   * Connect to the port, this will create a stream which will be available via
   * the `stream$` property of the service
   * @param options
   * @param pageUnload
   */
  public connect(options?: SerialOptions, pageUnload?: AbortSignal): void {
    if (!this.port) {
      connectionStatus.set(ApplicationStatus.ERROR, 'Cannot connect to device without an open port.')
      applicationSettings.update((state) => ({
        ...state,
        connectionStatus: ApplicationStatus.ERROR,
      }));
      return;
    }
    connectionStatus.set(ApplicationStatus.CONNECTING)
    applicationSettings.update((state) => ({
      ...state,
      connectionStatus: ApplicationStatus.CONNECTING,
    }));
    this.stopCtrl = new AbortController();

    if (pageUnload) {
      pageUnload.onabort = () => {
        this?.stopCtrl?.abort();
      };
    }

    fromWebSerial(this.port, this.writer$.asObservable(), options, this.stopCtrl.signal)
      .pipe(
        tapOnFirstEmit(() => {
          this.connectedValue$.next(true);
          this.isConnected = true;
          connectionStatus.set(ApplicationStatus.CONNECTED)
          applicationSettings.update((state) => ({
            ...state,
            connectionStatus: ApplicationStatus.CONNECTED,
          }));
        }),

        tap((value) => this.output$.next(value)),
        finalize(() => {
          connectedDevice.reset();
          connectionStatus.set(ApplicationStatus.DISCONNECTED);
          applicationSettings.update((state) => ({
            ...state,
            connectionStatus: ApplicationStatus.DISCONNECTED,
          }));
        }),
      )
      .subscribe();
  }

  /**
   * Disconnect from the serial device
   */
  public disconnect(): void {
    if (this.stopCtrl) {
      this.stopCtrl.abort();
    }
  }

  /**
   * Send a message to the serial port
   * @param message
   */
  public sendMessage(message: Uint8Array): void {
    this.writer$.next(message);
  }
}

export const serialService = new WebSerialService();
