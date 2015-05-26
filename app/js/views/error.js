import { View } from 'components/fxos-mvc/dist/mvc';

var template = `
  <div class="error-bkg"></div>
  <div class="error-msg">
    <h1>Device not supported</h1>
    <p>We're not cool enough to support your device.</p>
    <a>Try a <a href="https://www.mozilla.org/en-US/firefox/os/devices/">Firefox OS phone</a> instead.</p>
  </div>
  `;

export default
class ErrorView extends View {
  constructor(options) {
    console.log('ErrorView#constructor()');

    super(options);
  }

  init(controller) {
    console.log('ErrorView#init()');

    super(controller);
    this.render();
  }

  render() {
    console.log('ErrorView#render()');

    super();
  }

  template() {
    return template;
  }

  setActive(active) {
    this.el.classList.toggle('active', active);
  }
}
