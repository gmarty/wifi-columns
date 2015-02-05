import { Controller } from 'components/fxos-mvc/dist/mvc';

import HomeController from 'js/controllers/home';
import HostController from 'js/controllers/host';
import GuestController from 'js/controllers/guest';

import Settings from 'js/models/settings';

var wifiP2pManager = navigator.mozWifiP2pManager;
var wifiManager = navigator.mozWifiManager;

var displayError = error => {
  var message = (error.message || error.name || 'Unknown error');
  console.error(message);
};

export default
class MainController extends Controller {
  constructor() {
    console.log('MainController#constructor()');

    this.settings = new Settings();

    this.controllers = {
      home: new HomeController({settings: this.settings}),
      host: new HostController(),
      guest: new GuestController()
    };

    this.preferredWps = 'pbc';

    this.init();
  }

  init() {
    console.log('MainController#init()');

    // Attach event listeners.
    wifiP2pManager.addEventListener('statuschange', this);
    wifiP2pManager.addEventListener('enabled', this);
    wifiP2pManager.addEventListener('disabled', this);
    wifiP2pManager.addEventListener('peerinfoupdate', this);
    this.controllers.home.view.getPeersList.addEventListener('click', this);
    this.controllers.home.view.peersList.addEventListener('click', this);
    this.controllers.host.view.disconnect.addEventListener('click', this);
    this.controllers.guest.view.disconnect.addEventListener('click', this);

    // Set the WPS method.
    wifiManager.wps({method: this.preferredWps});

    this.setDeviceName();

    // Listen to pairing request messages.
    navigator.mozSetMessageHandler('wifip2p-pairing-request', request => {
      console.log('wifip2p-pairing-request', request);

      if (request.wpsMethod !== this.preferredWps) {
        displayError(new Error('Uncompatible pairing method: ' + request.wpsMethod + '.'));
        return;
      }

      wifiP2pManager.setPairingConfirmation(true, '');
    });
  }

  main() {
    console.log('MainController#main()');

    this.enable();
    this.setActiveController('home');
  }

  setActiveController(controllerName) {
    if (this.activeController === this.controllers[controllerName]) {
      return;
    }

    if (this.activeController) {
      this.activeController.teardown();
    }

    this.activeController = this.controllers[controllerName];
    this.activeController.main();
  }

  enable() {
    wifiP2pManager.setScanEnabled(true)
      .then(result => {
        console.log('wifiP2pManager#enable().then()');

        if (!result || !wifiP2pManager.enabled) {
          displayError(new Error('wifiP2pManager activation failed.'));
          return;
        }

        this.getPeerList();
      })
      .catch(displayError);
  }

  /**
   * Set the device name.
   */
  setDeviceName() {
    wifiP2pManager.setDeviceName(this.settings.deviceName)
      .then(result => {
        console.log('wifiP2pManager#setDeviceName().then()');

        if (!result) {
          displayError(new Error('The device name could not be set.'));
        }
      })
      .catch(displayError);
  }

  /**
   * Get the list of peers and assign it to `this.settings.peers`.
   */
  getPeerList() {
    wifiP2pManager.getPeerList()
      .then(peers => {
        console.log('wifiP2pManager#getPeerList().then()', peers);

        // Filter out peers with unsupported WPS methods.
        this.settings.peers = peers.filter(
            peer => peer.wpsCapabilities.indexOf(this.preferredWps) >= 0
        );
      })
      .catch(displayError);
  }

  /**
   * Connect to a peer which data are provided.
   *
   * @param {Object} peer
   */
  toggleConnection(peer) {
    switch (peer.connectionStatus) {
      case 'disconnected':
        wifiP2pManager.connect(peer.address, this.preferredWps, 1)
          .then(result => {
            console.log('wifiP2pManager#connect().then()');

            if (!result) {
              displayError(new Error('Could not connect to ' + peer.name + '.'));
            }
          })
          .catch(displayError);
        break;

      case 'connecting':
      // We abort the connecting attempt when tapping a connecting peer.
      case 'connected':
        this.disconnect();
        break;
    }
  }

  disconnect() {
    if (wifiP2pManager.groupOwner) {
      wifiP2pManager.disconnect(wifiP2pManager.groupOwner.macAddress);
    }

    this.setActiveController('home');
  }

  /**
   * General handler for event listeners.
   *
   * @param {Object} evt
   */
  handleEvent(evt) {
    console.log(evt.type, evt);

    switch (evt.type) {
      case 'enabled':
      case 'disabled':
        break;

      case 'peerinfoupdate':
      case 'statuschange':
        this.getPeerList();

        if (wifiP2pManager.groupOwner) {
          // A connection is ready, start the appropriate controller.
          if (wifiP2pManager.groupOwner.isLocal) {
            this.setActiveController('host');
          } else {
            this.setActiveController('guest');
          }
        } else {
          this.disconnect();
        }
        break;

      case 'click':
        switch (evt.target) {
          case this.controllers.home.view.getPeersList:
            this.enable();
            break;

          case this.controllers.host.view.disconnect:
          case this.controllers.guest.view.disconnect:
            this.disconnect();
            break;

          default:
            if (evt.target.parentNode === this.controllers.home.view.peersList) {
              var dataset = evt.target.dataset;
              var peer = {
                name: dataset.name,
                address: dataset.address,
                connectionStatus: dataset.connectionStatus
              };

              this.toggleConnection(peer);
              break;
            }
            break;
        }
        break;
    }
  }
}
