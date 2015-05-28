import /* global HTTPServer */ 'components/fxos-web-server/dist/fxos-web-server';

import { Controller } from 'components/fxos-mvc/dist/mvc';

import HostView from 'js/views/host';

import EmulatorUi from 'js/lib/emulatorUi';

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

    this.view.setActive(true);

    this.sms.reloadRom();
    this.sms.reset();
    this.sms.vdp.forceFullRedraw();
    this.sms.start();

    var canvas = this.sms.ui.screen;

    //FIXME: find the correct key mapping?
    var gamepad = {
      up: 0x01,
      down: 0x02,
      left: 0x01,
      right: 0x02,
      fire1: 0x08,
      fire2: 0x04,
      start: 0x10
    };
    var sms = this.sms;

    this.httpServer.addEventListener('request', evt => {
      var request = evt.request;
      var response = evt.response;

      var path = decodeURIComponent(request.path);
      if (path.length > 1) {
        //receive gamepad action and send it to sms
        var action = request.params.action;
        if (!action || !gamepad[action]) {
          sms.keyboard.controller2 = 0xFF;
        }
        else {
          sms.keyboard.controller2 &= ~gamepad[action];
        }
        response['Content-Type'] = 'text/html';
        response.send('');
      }
      else {
        response['Content-Type'] = 'text/html';
        response.send(canvas.toDataURL());
      }
    });

    this.httpServer.start();
  }

  teardown() {
    console.log('HostController#teardown()');

    this.view.setActive(false);

    this.sms.stop();
    this.httpServer.stop();
  }
}
