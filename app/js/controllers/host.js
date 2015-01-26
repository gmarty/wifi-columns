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

    this.httpServer.addEventListener('request', evt => {
      var response = evt.response;

      response['Content-Type'] = 'text/html';
      response.send(canvas.toDataURL());
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
