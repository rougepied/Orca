import { Operator } from "../operator";

export class OperatorCC extends Operator {
  name = "cc";
  info = "Sends MIDI control change";

  constructor(orca, x, y) {
    super(orca, x, y, "!", true);
    this.ports.channel = { x: 1, y: 0 };
    this.ports.knob = { x: 2, y: 0, clamp: { min: 0 } };
    this.ports.value = { x: 3, y: 0, clamp: { min: 0 } };
  }

  operation(force = false) {
    if (!this.hasNeighbor("*") && force === false) {
      return;
    }
    if (this.listen(this.ports.channel) === ".") {
      return;
    }
    if (this.listen(this.ports.knob) === ".") {
      return;
    }

    const channel = this.listen(this.ports.channel, true);
    if (channel > 15) {
      return;
    }
    const knob = this.listen(this.ports.knob, true);
    const rawValue = this.listen(this.ports.value, true);
    const value = Math.ceil((127 * rawValue) / 35);

    this.orca.client.io.cc.stack.push({ channel, knob, value, type: "cc" });

    this.draw = false;

    if (force === true) {
      this.orca.client.io.cc.run();
    }
  }
}
