'use strict';

export default
class EmulatorUi {
  constructor(sms) {
    this.main = sms;

    // Create UI
    var ui = document.createElement('div');

    ui.innerHTML = `
      <div class="screen">
        <canvas width="256" height="192" moz-opaque></canvas>
      </div>
      <div class="gamepad">
        <div class="direction">
          <div class="up"></div><div class="right"></div><div class="left"></div><div class="down"></div>
        </div>
        <div class="buttons">
          <div class="fire1"></div>
          <div class="fire2"></div>
        </div>
      </div>
      `;

    // General settings
    this.requestAnimationFrame = window.requestAnimationFrame.bind(window);

    // Screen
    this.screen = ui.querySelector('canvas');
    var gamepadContainer = ui.querySelector('.gamepad');

    this.canvasContext = this.screen.getContext('2d', {'alpha': false});

    // Nearest-neighbour rendering for scaling pixel-art.
    this.canvasContext.mozImageSmoothingEnabled = false;

    this.canvasImageData = this.canvasContext.getImageData(0, 0, 256, 192);

    // Gamepad
    var gamepad = {
      up: 0x01,
      down: 0x02,
      left: 0x04,
      right: 0x08,
      fire1: 0x10,
      fire2: 0x20
    };

    // Software buttons - touch
    var onTouchStart = evt => {
      this.main.keyboard.controller1 = 0xFF;

      var changedTouches = evt.changedTouches;

      for (var i = 0; i < changedTouches.length; i++) {
        var target = document.elementFromPoint(changedTouches[i].clientX, changedTouches[i].clientY);
        var className = target.className;

        if (!className || !gamepad[className]) {
          continue;
        }

        this.main.keyboard.controller1 &= ~gamepad[className];
      }

      evt.preventDefault();
    };

    var onTouchEnd = () => {
      this.main.keyboard.controller1 = 0xFF;
    };

    gamepadContainer.addEventListener('touchstart', onTouchStart);
    gamepadContainer.addEventListener('touchmove', onTouchStart);
    gamepadContainer.addEventListener('touchend', onTouchEnd);

    document.querySelector('#host div.emulator').appendChild(ui);

    // Load ROM file.
    var xhr = new XMLHttpRequest({mozSystem: true, mozAnon: true});
    xhr.open('get', 'rom/Columns (UE) [!].sms', true);
    xhr.overrideMimeType('text/plain; charset=x-user-defined');
    xhr.onload = () => {
      if (xhr.readyState === 4 && xhr.status === 200 && xhr.response) {
        this.loadROMFile(xhr.response, 'Columns (UE) [!].sms');
      }
    };
    xhr.onerror = evt => {
      console.log(evt);
      throw new Error('There was an error in receiving data.');
    };
    xhr.send();
  }

  reset() {
  }

  loadROMFile(data, filename) {
    this.main.stop();
    this.main.readRomDirectly(data, filename);
    this.main.reset();
    this.main.vdp.forceFullRedraw();
    this.enable();

    this.main.start();
  }

  enable() {
  }

  updateStatus() {
  }

  writeAudio() {
  }

  /**
   * Update the canvas screen. ATM, prevBuffer is not used. See JSNES for
   * an implementation of differential update.
   */
  writeFrame() {
    this.canvasContext.putImageData(this.canvasImageData, 0, 0);
  }
}
