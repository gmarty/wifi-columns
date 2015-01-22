import { View } from 'components/fxos-mvc/dist/mvc';

var template = `
  <div>Connected as guest</div>
  <input type="button" value="Disconnect" class="disconnect">
  `;

export default
class GuestView extends View {
  constructor(options) {
    console.log('GuestView#constructor()');

    super(options);
  }

  init(controller) {
    console.log('GuestView#init()');

    super(controller);
    this.render();

    this.disconnect = this.$('input.disconnect');
  }

  render() {
    console.log('GuestView#render()');

    super();
  }

  template() {
    return template;
  }

  setActive(active) {
    this.el.classList.toggle('active', active);
  }
}
