import { View } from 'components/fxos-mvc/dist/mvc';

var template = `
  <div class="emulator">
    <input type="button" value="Disconnect" class="disconnect">
  </div>
  `;

export default
class HostView extends View {
  constructor(options) {
    console.log('HostView#constructor()');

    super(options);
  }

  init(controller) {
    console.log('HostView#init()');

    super(controller);
    this.render();

    this.disconnect = this.$('input.disconnect');
  }

  render() {
    console.log('HostView#render()');

    super();
  }

  template() {
    return template;
  }

  setActive(active) {
    this.el.classList.toggle('active', active);
  }
}
