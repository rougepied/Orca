import { Operator } from "../operator.js";

export class OperatorC extends Operator {
  name = "clock";
  info = "Outputs modulo of frame";

  constructor(orca, x, y, passive) {
    super(orca, x, y, "c", passive);

    this.ports.rate = { x: -1, y: 0, clamp: { min: 1 } };
    this.ports.mod = { x: 1, y: 0, default: "8" };
    this.ports.output = { x: 0, y: 1, sensitive: true, output: true };
  }

  operation(force = false) {
    const rate = this.listen(this.ports.rate, true);
    const mod = this.listen(this.ports.mod, true);
    const val = Math.floor(this.orca.f / rate) % mod;
    return this.orca.keyOf(val);
  }
}
