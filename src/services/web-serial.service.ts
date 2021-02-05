import { fromWebSerial, tapOnFirstEmit } from '@rxjs-ninja/rxjs-utility';
import { Observable, Subject } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import { connectedDevice } from '../state/application';
import { ApplicationStatus } from '../constants/application';
import { connectionStatus } from '../state/connection-status';

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

  constructor() {
    if (WebSerialService._instance) {
      return WebSerialService._instance;
    }
    WebSerialService._instance = this;
    connectionStatus.status(ApplicationStatus.DISCONNECTED);
  }

  public setupListeners() {
    document.addEventListener('DOMContentLoaded', async () => {
      let ports = await navigator.serial.getPorts();
      connectionStatus.setDevices(ports.length);
    });

    navigator.serial.addEventListener('connect', (e) => {
      connectionStatus.addDevice();
    });

    navigator.serial.addEventListener('disconnect', (e) => {
      connectionStatus.removeDevice();
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
    connectionStatus.status(ApplicationStatus.AWAITING_PORT);

    try {
      this.port = await navigator.serial.requestPort(options);
    } catch (e) {
      connectionStatus.status(ApplicationStatus.USER_CANCELLED);
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
      connectionStatus.status(ApplicationStatus.ERROR, 'Cannot connect to device without an open port.');
      return;
    }
    connectionStatus.status(ApplicationStatus.CONNECTING);
    this.stopCtrl = new AbortController();

    if (pageUnload) {
      pageUnload.onabort = () => {
        this?.stopCtrl?.abort();
      };
    }

    fromWebSerial(this.port, this.writer$.asObservable(), options, this.stopCtrl.signal)
      .pipe(
        tapOnFirstEmit(() => {
          connectedDevice.setProduct(this?.port?.getInfo() || {});
          connectionStatus.status(ApplicationStatus.CONNECTED);
        }),

        tap((value) => this.output$.next(value)),
        finalize(() => {
          connectedDevice.reset();
          connectionStatus.status(ApplicationStatus.DISCONNECTED);
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
