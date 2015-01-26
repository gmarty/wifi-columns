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

    this.tainted = false;
    this.src = '';
  }

  main() {
    console.log('GuestController#main()');

    this.view.setActive(true);

    this.view.clearImage();

    this.imageInterval = setInterval(() => {
      var xhr = new XMLHttpRequest({mozSystem: true, mozAnon: true});
      xhr.open('get', 'http://' + wifiP2pManager.groupOwner.ipAddress + ':8080');
      xhr.addEventListener('load', () => {
        if (xhr.readyState === 4 && xhr.status === 200 && xhr.response) {
          this.src = xhr.response;
          this.tainted = true;
        } else {
          console.error('Error getting the image data.');
        }
      });
      xhr.addEventListener('error', evt => {
        console.log(evt);
        throw new Error('There was an error in receiving data.');
      });
      xhr.send();
    }, 300);

    var updateSrc = () => {
      if (this.tainted) {
        this.view.image.src = this.src;
        this.tainted = false;
      }
      this.animation = requestAnimationFrame(updateSrc);
    };

    updateSrc();
  }

  teardown() {
    console.log('GuestController#teardown()');

    this.view.setActive(false);

    clearInterval(this.imageInterval);
    cancelAnimationFrame(this.animation);
    this.view.clearImage();
  }
}
