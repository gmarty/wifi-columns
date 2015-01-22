import { Controller } from 'components/fxos-mvc/dist/mvc';

import HomeView from 'js/views/home';

export default
class HomeController extends Controller {
  constructor(options) {
    console.log('HomeController#constructor()');

    this.view = new HomeView({
      el: document.getElementById('home')
    });
    super(options);

    // Observe new peers and update the view accordingly.
    this.settings.on('peers', () => {
      this.view.renderPeer(this.settings.peers);
    });
  }

  main() {
    console.log('HomeController#main()');

    this.view.setActive(true);
  }

  teardown() {
    console.log('HomeController#teardown()');

    this.view.setActive(false);
  }
}
