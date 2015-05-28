import /* global HTTPServer */ 'components/fxos-web-server/dist/fxos-web-server';

import { Controller } from 'components/fxos-mvc/dist/mvc';

import HostView from 'js/views/host';

import EmulatorUi from 'js/lib/emulatorUi';

const P2_GAMEPAD = {
  up: 0x40,
  down: 0x80,
  left: 0x01,
  right: 0x02,
  fire1: 0x04,
  fire2: 0x08
};

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

    // @todo Load the ROM file at startup but only instantiate JSSMS in main().
    var JSSMS = window.JSSMS;
    this.sms = new JSSMS({
      ENABLE_COMPILER: false,
      'ui': EmulatorUi
    });
  }

  main() {
    console.log('HostController#main()');

    this.sms.reloadRom();
    this.sms.reset();
    this.sms.vdp.forceFullRedraw();
    this.sms.start();

    var canvas = this.sms.ui.screen;

    this.httpServer.addEventListener('request', evt => {
      var response = evt.response;
      var action = evt.request.params.a;

      response['Content-Type'] = 'text/html';

      if (action) {
        // Gamepad key pressed received from player 2.
        if (!action || !P2_GAMEPAD[action]) {
          this.sms.keyboard.controller2 = 0xFF;
        } else {
          this.sms.keyboard.controller2 &= ~P2_GAMEPAD[action];
        }

        response.send('');
        return;
      }

      // Otherwise, we send an image of the screen.
      response.send(canvas.toDataURL());
    });

    this.httpServer.start();

    this.view.setActive(true);
  }

  teardown() {
    console.log('HostController#teardown()');

    this.view.setActive(false);

    this.httpServer.stop();
    this.sms.stop();
  }
}
