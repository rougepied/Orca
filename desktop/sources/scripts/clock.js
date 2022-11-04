//@ts-check

export class Clock {
  constructor(client) {
    const workerScript =
      "onmessage = (e) => { setInterval(() => { postMessage(true) }, e.data)}";
    this.worker = window.URL.createObjectURL(
      new Blob([workerScript], { type: "text/javascript" })
    );
    this.client = client;
    this.isPaused = true;
    this.timer = null;
    this.isPuppet = false;

    this.speed = { value: 120, target: 120 };

    // External Clock
    this.pulse = {
      count: 0,
      /** @type {number?} */
      last: null,
      /** @type {number?} */
      timer: null,
      frame: 0, // paused frame counter
    };
  }
  start() {
    const memory = Number(window.localStorage.getItem("bpm"));
    const target = memory >= 60 ? memory : 120;
    this.setSpeed(target, target, true);
    this.play();
  }

  touch() {
    this.stop();
    this.client.run();
  }

  run() {
    if (this.speed.target === this.speed.value) {
      return;
    }
    this.setSpeed(
      this.speed.value + (this.speed.value < this.speed.target ? 1 : -1),
      null,
      true
    );
  }

  /**
   *
   * @param {*} value
   * @param {number?} target
   * @param {*} setTimer
   * @returns
   */
  setSpeed(value, target = null, setTimer = false) {
    if (
      this.speed.value === value &&
      this.speed.target === target &&
      this.timer
    ) {
      return;
    }
    if (value) {
      this.speed.value = clamp(value, 60, 300);
    }
    if (target) {
      this.speed.target = clamp(target, 60, 300);
    }
    if (setTimer === true) {
      this.setTimer(this.speed.value);
    }
  }

  modSpeed(mod = 0, animate = false) {
    if (animate === true) {
      this.setSpeed(null, this.speed.target + mod);
    } else {
      this.setSpeed(this.speed.value + mod, this.speed.value + mod, true);
      this.client.update();
    }
  }

  // Controls
  togglePlay(msg = false) {
    if (this.isPaused === true) {
      this.play(msg);
    } else {
      this.stop(msg);
    }
    this.client.update();
  }

  play(msg = false, midiStart = false) {
    console.log("Clock", "Play", msg, midiStart);
    if (this.isPaused === false && !midiStart) {
      return;
    }
    this.isPaused = false;
    if (this.isPuppet === true) {
      console.warn("Clock", "External Midi control");
      if (!this.pulse.frame || midiStart) {
        // no frames counted while paused (starting from no clock, unlikely) or triggered by MIDI clock START
        this.setFrame(0); // make sure frame aligns with pulse count for an accurate beat
        this.pulse.frame = 0;
        this.pulse.count = 5; // by MIDI standard next pulse is the beat
      }
    } else {
      if (msg === true) {
        this.client.io.midi.sendClockStart();
      }
      this.setSpeed(this.speed.target, this.speed.target, true);
    }
  }

  stop(msg = false) {
    console.log("Clock", "Stop");
    if (this.isPaused === true) {
      return;
    }
    this.isPaused = true;
    if (this.isPuppet === true) {
      console.warn("Clock", "External Midi control");
    } else {
      if (msg === true || this.client.io.midi.isClock) {
        this.client.io.midi.sendClockStop();
      }
      this.clearTimer();
    }
    this.client.io.midi.allNotesOff();
    this.client.io.midi.silence();
  }

  tap() {
    this.pulse.count = (this.pulse.count + 1) % 6;
    this.pulse.last = performance.now();
    if (!this.isPuppet) {
      console.log("Clock", "Puppeteering starts..");
      this.isPuppet = true;
      this.clearTimer();
      this.pulse.timer = window.setInterval(() => {
        if (performance.now() - (this.pulse.last ?? 0) < 2000) {
          return;
        }
        this.untap();
      }, 2000);
    }
    if (this.pulse.count == 0) {
      if (this.isPaused) {
        this.pulse.frame++;
      } else {
        if (this.pulse.frame > 0) {
          this.setFrame(this.client.orca.f + this.pulse.frame);
          this.pulse.frame = 0;
        }
        this.client.run();
      }
    }
  }

  untap() {
    console.log("Clock", "Puppeteering stops..");
    if (this.pulse.timer) {
      clearInterval(this.pulse.timer);
    }
    this.isPuppet = false;
    this.pulse.frame = 0;
    this.pulse.last = null;
    if (!this.isPaused) {
      this.setTimer(this.speed.value);
    }
  }

  // Timer
  setTimer(bpm) {
    if (bpm < 60) {
      console.warn("Clock", "Error " + bpm);
      return;
    }
    this.clearTimer();
    window.localStorage.setItem("bpm", bpm);
    this.timer = new Worker(this.worker);
    this.timer.postMessage(60000 / parseInt(bpm) / 4);
    this.timer.onmessage = (event) => {
      this.client.io.midi.sendClock();
      this.client.run();
    };
  }

  clearTimer() {
    if (this.timer) {
      this.timer.terminate();
    }
    this.timer = null;
  }

  setFrame(f) {
    if (isNaN(f)) {
      return;
    }
    this.client.orca.f = clamp(f, 0, 9999999);
  }

  // UI
  toString() {
    const diff = this.speed.target - this.speed.value;
    const _offset = Math.abs(diff) > 5 ? (diff > 0 ? `+${diff}` : diff) : "";
    const _message =
      this.isPuppet === true ? "midi" : `${this.speed.value}${_offset}`;
    const _beat = diff === 0 && this.client.orca.f % 4 === 0 ? "*" : "";
    return `${_message}${_beat}`;
  }
}
function clamp(v, min, max) {
  return v < min ? min : v > max ? max : v;
}
