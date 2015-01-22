import /* global HTTPServer */ 'components/fxos-web-server/dist/fxos-web-server';

import { Controller } from 'components/fxos-mvc/dist/mvc';

import HostView from 'js/views/host';

//var wifiP2pManager = navigator.mozWifiP2pManager;
//var wifiManager = navigator.mozWifiManager;

export default
class HostController extends Controller {
  constructor() {
    console.log('HostController#constructor()');

    this.view = new HostView({
      el: document.getElementById('host')
    });
    this.httpServer = new HTTPServer(8080);
    super();

    this.init();
  }

  init() {
    console.log('HostController#init()');

    var canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 192;
    canvas.mozOpaque = true;

    this.canvasContext = canvas.getContext('2d', {'alpha': false});
    this.canvasContext.mozImageSmoothingEnabled = false;

    var canvasImageData = this.canvasContext.getImageData(0, 0, 256, 192);
    var data = canvasImageData.data;
    for (var i = 0; i < 256 * 192 * 4; i = i + 4) {
      data[i + 0] = Math.round(Math.random() * 256);
      data[i + 1] = Math.round(Math.random() * 256);
      data[i + 2] = Math.round(Math.random() * 256);
      data[i + 3] = 0xFF;
    }

    this.canvasContext.putImageData(canvasImageData, 0, 0);
    this.dataUrl = canvas.toDataURL();

    /*var img = document.createElement('img');
    img.src = this.dataUrl;
    document.getElementById('home').appendChild(img);*/
  }

  main() {
    console.log('HostController#main()');

    this.view.setActive(true);

    this.httpServer.addEventListener('request', evt => {
      var response = evt.response;

      console.log('Web server request event', evt);

      response['Content-Type'] = 'text/html';
      response.send('<html><img src="' + this.dataUrl + '"></html>');

      /*response.send('{' + '\n' +
      'type:' + Math.round(Math.random() * 999) + ',' + '\n' +
      'isLocal:' + wifiP2pManager.groupOwner.isLocal + ',' + '\n' +
      'ipAddress:' + wifiP2pManager.groupOwner.ipAddress + ',' + '\n' +
      'macAddress:' + wifiP2pManager.groupOwner.macAddress + ',' + '\n' +
      'localMacAddress:' + wifiManager.macAddress + ',' + '\n' +
      'peerName:' + this.settings.peerName + '' + '\n' +
      '}');*/
    });

    this.httpServer.start();
  }

  teardown() {
    console.log('HostController#teardown()');

    this.view.setActive(false);
    this.httpServer.stop();
  }
}
