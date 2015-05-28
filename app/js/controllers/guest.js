import { Controller } from 'components/fxos-mvc/dist/mvc';

import GuestView from 'js/views/guest';

var wifiP2pManager = navigator.mozWifiP2pManager;

const P2_GAMEPAD = {
  up: 0x40,
  down: 0x80,
  left: 0x01,
  right: 0x02,
  fire1: 0x04,
  fire2: 0x08
};

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

    this.view.gamepadContainer.addEventListener('touchstart', this);
    this.view.gamepadContainer.addEventListener('touchmove', this);
    this.view.gamepadContainer.addEventListener('touchend', this);

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

    this.view.setActive(true);
  }

  teardown() {
    console.log('GuestController#teardown()');

    this.view.setActive(false);

    this.view.gamepadContainer.removeEventListener('touchstart', this);
    this.view.gamepadContainer.removeEventListener('touchmove', this);
    this.view.gamepadContainer.removeEventListener('touchend', this);

    clearInterval(this.imageInterval);
    cancelAnimationFrame(this.animation);
    this.view.clearImage();
  }

  // @todo Refactor to merge both XHR calls into a single one.
  sendAction(action) {
    var xhr = new XMLHttpRequest({mozSystem: true, mozAnon: true});
    xhr.open('get', 'http://' + wifiP2pManager.groupOwner.ipAddress + ':8080/?a=' + action);
    xhr.addEventListener('load', () => {
      if (xhr.readyState !== 4 || xhr.status !== 200) {
        console.error('Error sending action command.');
      }
    });
    xhr.addEventListener('error', evt => {
      console.log(evt);
      throw new Error('There was an error in sending data.');
    });
    xhr.send();
  }

  /**
   * General handler for event listeners.
   *
   * @param {Object} evt
   */
  handleEvent(evt) {
    switch (evt.type) {
      case 'touchstart':
      case 'touchmove':
        this.sendAction('');

        var changedTouches = evt.changedTouches;

        for (var i = 0; i < changedTouches.length; i++) {
          var target = document.elementFromPoint(changedTouches[i].clientX, changedTouches[i].clientY);
          var action = target.className;

          if (!action || !P2_GAMEPAD[action]) {
            continue;
          }

          // @todo Send the activated bits in a single call instead.
          this.sendAction(action);
        }

        evt.preventDefault();
        break;

      case 'touchend':
        this.sendAction('');
        break;
    }
  }
}
