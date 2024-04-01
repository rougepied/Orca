import { Operator } from "../operator";

export class OperatorR extends Operator {
  name = "random";
  info = "Outputs random value";

  constructor(orca, x, y, passive) {
    super(orca, x, y, "r", passive);

    this.ports.min = { x: -1, y: 0 };
    this.ports.max = { x: 1, y: 0 };
    this.ports.output = { x: 0, y: 1, sensitive: true, output: true };
  }

  operation(force = false) {
    const min = this.listen(this.ports.min, true);
    const max = this.listen(this.ports.max, true);
    const val = Number.parseInt(
      Math.random() * ((max > 0 ? max : 36) - min) + min,
    );
    return this.orca.keyOf(val);
  }
}
