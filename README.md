# ![Wi-Fi Columns](https://raw.githubusercontent.com/gmarty/wifi-columns/master/app/img/icons/32.png "Wi-Fi Columns") Wi-Fi Columns

Play Columns with your friends locally, no Internet connection required!

## How to use it?

1. Have 2 devices running Firefox OS (Flame or Nexus 4).
2. [Enable Wi-Fi Direct](https://gist.github.com/justindarc/1d88d7d14e3264e8a666) on each device.
3. Perform the action described in `/app/rom/README.md`.
4. Run `npm install && gulp build`.
5. Flash the `/dist/app` folder on both devices using Firefox desktop WebIDE.
6. Have fun, break things and file bugs!

## How does it work?

This app uses the Wi-Fi Direct API, as implemented in Firefox OS. Read the
following resources to know more:

* An [article I wrote for Mozilla Hacks](https://hacks.mozilla.org/2015/01/the-p2p-web-wi-fi-direct-in-firefox-os/)
* The page about [MozWifiP2pManager](https://developer.mozilla.org/en-US/docs/Web/API/MozWifiP2pManager) on MDN

## Demo

[![Demo of Wi-Fi Columns](https://img.youtube.com/vi/HAuXWPS5rwA/0.jpg)](//youtu.be/HAuXWPS5rwA)
