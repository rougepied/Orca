//@ts-check

export class Mono {
  constructor(client) {
    this.client = client;
    this.stack = [];
  }
  start() {
    console.info("MidiMono Starting..");
  }

  clear() {}

  run() {
    for (const id in this.stack) {
      if (this.stack[id].length < 1) {
        this.release(this.stack[id]);
      }
      if (!this.stack[id]) {
        continue;
      }
      if (this.stack[id].isPlayed === false) {
        this.press(this.stack[id]);
      }
      this.stack[id].length--;
    }
  }

  press(item) {
    if (!item) {
      return;
    }
    this.client.io.midi.trigger(item, true);
    item.isPlayed = true;
  }

  release(item) {
    if (!item) {
      return;
    }
    this.client.io.midi.trigger(item, false);
    delete this.stack[item.channel];
  }

  silence() {
    for (const item of this.stack) {
      this.release(item);
    }
  }

  push(channel, octave, note, velocity, length, isPlayed = false) {
    if (this.stack[channel]) {
      this.release(this.stack[channel]);
    }
    this.stack[channel] = { channel, octave, note, velocity, length, isPlayed };
  }

  length() {
    return Object.keys(this.stack).length;
  }
}
