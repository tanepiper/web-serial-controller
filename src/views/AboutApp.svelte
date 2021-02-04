<fieldset>
  <legend>About App</legend>
  <div class="window-body">
    Welcome to the Web Serial Connector Application. If you are not seeing a Blue Screen Of Death then congratulations!
    You can use the Web Serial API.
  </div>
  <div class="window-body">
    The <a href="https://wicg.github.io/serial/">Web Serial API</a> allows for browsers to connect to devices - such as
    <a href="https://www.arduino.cc/">Arduino</a> or <a href="https://www.raspberrypi.org/">RaspberryPi</a> - over USB or
    Bluetooth serial connection.
  </div>
  <div class="window-body">
    If you don't have one of these devices, don't worry! You can test it out using Bluetooth serial with your mobile
    phone. After connecting your phone to your computer device via Bluetooth, you can download one of the following apps
    to allow communication:
    <ul>
      <li>
        <strong>For Android:</strong>&nbsp;
        <a href="https://play.google.com/store/apps/details?id=de.kai_morich.serial_bluetooth_terminal&hl=en&gl=US"
          >Serial Bluetooth Terminal</a
        >
      </li>
      <li>
        <strong>For iOS:</strong>&nbsp;
        <a href="https://apps.apple.com/us/app/ble-to-serial-terminal/id1238004134">BLE to Serial Terminal</a>
      </li>
    </ul>
  </div>
</fieldset>

<fieldset>
  <legend>Built With</legend>
  <div class="window-body">
    This app was written by <a href="https://tane.dev">Tane Piper</a>. Source code is available on
    <a href="https://github.com/tanepiper/web-serial-controller">GitHub</a>
  </div>
  <div class="window-body">
    <ul>
      <li>Application built with <a href="https://svelte.dev/">Svelte</a></li>
      <li>Themed with <a href="https://botoxparty.github.io/XP.css/">XP.css</a></li>
      <li><code>fromWebSerial</code> Observable from <a href="https://rxjs.ninja">RxJS Ninja</a></li>
    </ul>
  </div>
</fieldset>
<fieldset>
  <legend>Demos</legend>
  <div class="window-body">
    <ul class="tree-view">
      <li>Demos</li>
      <li>
        <details>
          <summary>Arduino</summary>
          <ul>
            <li>
              <a href="/demos/web_serial_demo_1.ino">Meaning Of Life</a> - Send a <code>1</code>,
              <code>2</code> or <code>42</code> to your device to get different lights and messages
            </li>
            <li>More soon....</li>
          </ul>
        </details>
      </li>
    </ul>
  </div>
</fieldset>
