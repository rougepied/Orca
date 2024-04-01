import { Operator } from "../operator";

export class OperatorPB extends Operator {
  name = "pb";
  info = "Sends MIDI pitch bend";

  constructor(orca, x, y) {
    super(orca, x, y, "?", true);

    this.ports.channel = { x: 1, y: 0, clamp: { min: 0, max: 15 } };
    this.ports.lsb = { x: 2, y: 0, clamp: { min: 0 } };
    this.ports.msb = { x: 3, y: 0, clamp: { min: 0 } };
  }

  operation(force = false) {
    if (!this.hasNeighbor("*") && force === false) {
      return;
    }
    if (this.listen(this.ports.channel) === ".") {
      return;
    }
    if (this.listen(this.ports.lsb) === ".") {
      return;
    }

    const channel = this.listen(this.ports.channel, true);
    const rawlsb = this.listen(this.ports.lsb, true);
    const lsb = Math.ceil((127 * rawlsb) / 35);
    const rawmsb = this.listen(this.ports.msb, true);
    const msb = Math.ceil((127 * rawmsb) / 35);

    this.orca.client.io.cc.stack.push({ channel, lsb, msb, type: "pb" });

    this.draw = false;

    if (force === true) {
      this.orca.client.io.cc.run();
    }
  }
}
