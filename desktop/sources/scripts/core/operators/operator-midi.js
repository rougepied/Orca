import { Operator } from "../operator";

export class OperatorMidi extends Operator {
  name = "midi";
  info = "Sends MIDI note";

  constructor(orca, x, y, passive) {
    super(orca, x, y, ":", true);
    this.ports.channel = { x: 1, y: 0 };
    this.ports.octave = { x: 2, y: 0, clamp: { min: 0, max: 8 } };
    this.ports.note = { x: 3, y: 0 };
    this.ports.velocity = {
      x: 4,
      y: 0,
      default: "f",
      clamp: { min: 0, max: 16 },
    };
    this.ports.length = {
      x: 5,
      y: 0,
      default: "1",
      clamp: { min: 0, max: 32 },
    };
  }

  operation(force = false) {
    if (!this.hasNeighbor("*") && force === false) {
      return;
    }
    if (this.listen(this.ports.channel) === ".") {
      return;
    }
    if (this.listen(this.ports.octave) === ".") {
      return;
    }
    if (this.listen(this.ports.note) === ".") {
      return;
    }
    // biome-ignore lint/suspicious/noGlobalIsNan: <explanation>
    if (!isNaN(this.listen(this.ports.note))) {
      return;
    }

    const channel = this.listen(this.ports.channel, true);
    if (channel > 15) {
      return;
    }
    const octave = this.listen(this.ports.octave, true);
    const note = this.listen(this.ports.note);
    const velocity = this.listen(this.ports.velocity, true);
    const length = this.listen(this.ports.length, true);

    this.orca.client.io.midi.push(channel, octave, note, velocity, length);

    if (force === true) {
      this.orca.client.io.midi.run();
    }

    this.draw = false;
  }
}
