import { View } from 'components/fxos-mvc/dist/mvc';

// A 1px × 1px black PNG encoded in base64.
var blankScreen = 'data:image/png;base64,' +
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVQIHWNgAAAAAgABz8g15QAAAABJRU5ErkJggg==';

var template = `
  <div class="emulator">
    <input type="button" value="Disconnect" class="disconnect">
    <img src="">
    <div class="gamepad">
      <div class="direction">
        <div class="up"></div><div class="right"></div><div class="left"></div><div class="down"></div>
      </div>
      <div class="buttons">
        <div class="start"></div>
        <div class="fire1"></div>
        <div class="fire2"></div>
      </div>
    </div>
  </div>
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
    this.emulator = this.$('.emulator');
    this.image = this.$('.emulator > img');

    this.clearImage();
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

  clearImage() {
    this.image.src = blankScreen;
  }
}
