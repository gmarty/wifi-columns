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
          <div class="start"></div>
          <div class="fire1"></div>
          <div class="fire2"></div>
        </div>
      </div>
      `;

    // General settings
    this.requestAnimationFrame = window.requestAnimationFrame.bind(window);

    // Screen
    this.screen = ui.querySelector('canvas');

    this.canvasContext = this.screen.getContext('2d', {'alpha': false});

    // Nearest-neighbour rendering for scaling pixel-art.
    this.canvasContext.mozImageSmoothingEnabled = false;

    this.canvasImageData = this.canvasContext.getImageData(0, 0, 256, 192);

    // Gamepad
    this.gamepad = {
      up: 0x01,
      right: 0x02,
      down: 0x04,
      left: 0x08,
      fire1: 0x10,
      fire2: 0x20
    };
    /*var startButton = ui.querSelector('.start');

    // Play button
    //self.main.start();

    // ROM loader
    var romFilename = '';
    var romReader = new FileReader();

    romReader.onload = function(evt) {
      var data = evt.target.result;
      self.loadROMFile(data, romFilename);
    };

    $('#romUpload').change(function() {
      if (document.getElementById('romUpload').files.length === 0) {
        return;
      }
      var oFile = document.getElementById('romUpload').files[0];
      romFilename = oFile.name;
      romReader.readAsBinaryString(oFile);
    });

    // ROM selector
    this.romSelect = $('#romSelector')
      .change(function() {
        self.loadROM();
      });*/

    // Buttons
    /*this.buttons.start = $('<button class="btn btn-primary" disabled="disabled">Start</button>')
     .click(function() {
     if (!self.main.isRunning) {
     self.main.start();
     self.buttons.start.attr('value', 'Pause');
     } else {
     self.main.stop();
     self.updateStatus('Paused');
     self.buttons.start.attr('value', 'Start');
     }
     });*/

    /*this.buttons.reset = $('<button class="btn" disabled="disabled">Reset</button>')
     .click(function() {
     if (!self.main.reloadRom()) {
     $(this).attr('disabled', 'disabled');
     return;
     }
     self.main.reset();
     self.main.vdp.forceFullRedraw();
     self.main.start();
     });*/

    /*if (this.main.soundEnabled) {
     this.buttons.sound = $('<button class="btn" disabled="disabled">Enable sound</button>')
     .click(function() {
     if (self.main.soundEnabled) {
     self.main.soundEnabled = false;
     self.buttons.sound.attr('value', 'Enable sound');
     } else {
     self.main.soundEnabled = true;
     self.buttons.sound.attr('value', 'Disable sound');
     }
     });
     }*/

    // @todo Add an exit fullScreen button.
    /*$('#fullscreen')
      .click(function() {
        var screen = */
    /** @type {HTMLDivElement} */
    /* (screenContainer[0]);

          if (screen.requestFullscreen) {
            screen.requestFullscreen();
          } else {
            screen.mozRequestFullScreen();
          }
        });

      // Software buttons - touch
      screenContainer.on('touchstart touchmove', function(evt) {
        self.main.keyboard.controller1 = 0xFF;

        var changedTouches = evt.originalEvent.changedTouches;

        for (var i = 0; i < changedTouches.length; i++) {
          var target = document.elementFromPoint(changedTouches[i].clientX, changedTouches[i].clientY);
          var className = target.className;

          if (className === 'gamepad' || !className) {
            continue;
          }

          var key = self.gamepad[className];
          self.main.keyboard.controller1 &= ~key;
        }

        evt.preventDefault();
      });

      screenContainer.on('touchend', function(evt) {
        self.main.keyboard.controller1 = 0xFF;
      });

      // Software buttons - click
      function mouseDown(evt) {
        var className = this.className;
        var key = self.gamepad[className];
        self.main.keyboard.controller1 &= ~key;
        evt.preventDefault();
      }

      function mouseUp(evt) {
        var className = this.className;
        var key = self.gamepad[className];
        self.main.keyboard.controller1 |= key;
        evt.preventDefault();
      }*/

    /*for (i in this.gamepad) {
      var el = screenContainer.querySelector('.' + i);
      el.mousedown(mouseDown);
      el.mouseup(mouseUp);
    }*/

    /*startButton
      .on('mousedown touchstart', function(evt) {
        if (self.main.is_sms) {
          self.main.pause_button = true;       // Pause
        } else {
          self.main.keyboard.ggstart &= ~0x80; // Start
        }
        evt.preventDefault();
      })
      .on('mouseup touchend', function(evt) {
        if (!self.main.is_sms) {
          self.main.keyboard.ggstart |= 0x80;  // Start
        }
        evt.preventDefault();
      });*/

    // Keyboard
    /*$(document)
      .bind('keydown', function(evt) {
        self.main.keyboard.keydown(evt);
        //console.log(self.main.keyboard.controller1, self.main.keyboard.ggstart);
      })
      .bind('keyup', function(evt) {
        self.main.keyboard.keyup(evt);
        //console.log(self.main.keyboard.controller1, self.main.keyboard.ggstart);
      });

    this.screen.appendTo(screenContainer);
    screenContainer.appendTo($(parent));

    if (roms !== undefined) {
      this.setRoms(roms);
    }*/

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

    //$('#play').removeClass('disabled');
    //$('#fullscreen').removeClass('disabled');
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
