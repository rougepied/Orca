import { Operator } from "../operator";

export class OperatorI extends Operator {
  name = "increment";
  info = "Increments southward operand";

  constructor(orca, x, y, passive) {
    super(orca, x, y, "i", passive);

    this.ports.step = { x: -1, y: 0, default: "1" };
    this.ports.mod = { x: 1, y: 0 };
    this.ports.output = {
      x: 0,
      y: 1,
      sensitive: true,
      reader: true,
      output: true,
    };
  }
  operation(force = false) {
    const step = this.listen(this.ports.step, true);
    const mod = this.listen(this.ports.mod, true);
    const val = this.listen(this.ports.output, true);
    return this.orca.keyOf((val + step) % (mod > 0 ? mod : 36));
  }
}
