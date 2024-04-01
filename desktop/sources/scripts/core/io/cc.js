//@ts-check

export class MidiCC {
  stack = [];
  offset = 64;

  constructor(client) {
    this.client = client;
  }

  start() {
    console.info("MidiCC", "Starting..");
  }

  clear() {
    this.stack = [];
  }

  run() {
    if (this.stack.length < 1) {
      return;
    }
    const device = this.client.io.midi.outputDevice();
    if (!device) {
      console.warn("CC", "No Midi device.");
      return;
    }
    for (const msg of this.stack) {
      if (
        msg.type === "cc" &&
        !Number.isNaN(msg.channel) &&
        !Number.isNaN(msg.knob) &&
        !Number.isNaN(msg.value)
      ) {
        device.send([0xb0 + msg.channel, this.offset + msg.knob, msg.value]);
      } else if (
        msg.type === "pb" &&
        !Number.isNaN(msg.channel) &&
        !Number.isNaN(msg.lsb) &&
        !Number.isNaN(msg.msb)
      ) {
        device.send([0xe0 + msg.channel, msg.lsb, msg.msb]);
      } else if (msg.type === "pg" && !Number.isNaN(msg.channel)) {
        if (!Number.isNaN(msg.bank)) {
          device.send([0xb0 + msg.channel, 0, msg.bank]);
        }
        if (!Number.isNaN(msg.sub)) {
          device.send([0xb0 + msg.channel, 32, msg.sub]);
        }
        if (!Number.isNaN(msg.pgm)) {
          device.send([0xc0 + msg.channel, msg.pgm]);
        }
      } else {
        console.warn("CC", "Unknown message", msg);
      }
    }
  }

  setOffset(offset) {
    if (Number.isNaN(offset)) {
      return;
    }
    this.offset = offset;
    console.log("CC", `Set offset to ${this.offset}`);
  }
}
