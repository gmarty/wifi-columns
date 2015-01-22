import { Controller } from 'components/fxos-mvc/dist/mvc';

import GuestView from 'js/views/guest';

var wifiP2pManager = navigator.mozWifiP2pManager;

export default
class GuestController extends Controller {
  constructor() {
    console.log('GuestController#constructor()');

    this.view = new GuestView({
      el: document.getElementById('guest')
    });
    super();

    this.init();
  }

  init() {
    console.log('GuestController#init()');

    // DEBUG
    this.frame = document.createElement('iframe');
    this.frame.mozbrowser = true;
    this.frame.style = `
        float: left;
        width: 100%;
        height: 50vw;
      `;
    this.view.el.appendChild(this.frame);
  }

  main() {
    console.log('GuestController#main()');

    this.view.setActive(true);

    var refreshFrame = () => {
      this.frame.src = 'http://' + wifiP2pManager.groupOwner.ipAddress + ':8080/';
      //requestAnimationFrame(refreshFrame);
    };

    setTimeout(() => {
      this.refreshInterval = setInterval(refreshFrame, 300);
      refreshFrame();
    }, 5000);

    //var interval = setInterval(function() {
    /*var xhr = new XMLHttpRequest({mozSystem: true, mozAnon: true});
    xhr.open('get', 'http://' + wifiP2pManager.groupOwner.ipAddress + ':8080', true);
    xhr.responseType = 'json';
    xhr.onload = function(evt) {
      console.log(evt);
      if (xhr.readyState === 4 && xhr.status === 200) {
        if (evt.target.response) {
          var offer = evt.target.response;

          if (offer.type !== 'offer') {
            return;
          }

          //submitOffer(offer);
          clearInterval(refreshFrameInterval);
          //clearInterval(interval);
        }
      }
    };
    xhr.onerror = function(evt) {
      console.log(evt);
      throw new Error('There was an error in receiving data.');
    };
    xhr.send();*/
    //}, 3000);
  }

  teardown() {
    console.log('GuestController#teardown()');

    this.view.setActive(false);
    clearInterval(this.refreshInterval);
    this.frame.src = '';
  }
}
