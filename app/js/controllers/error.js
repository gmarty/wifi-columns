import { Controller } from 'components/fxos-mvc/dist/mvc';

import ErrorView from 'js/views/error';

export default
class ErrorController extends Controller {
  constructor(options) {
    console.log('ErrorController#constructor()');

    this.view = new ErrorView({
      el: document.getElementById('error')
    });
    super(options);
  }

  main() {
    console.log('ErrorController#main()');

    this.view.setActive(true);
  }

  teardown() {
    console.log('ErrorController#teardown()');

    this.view.setActive(false);
  }
}
