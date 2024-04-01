import { Operator } from "../operator";

export class OperatorM extends Operator {
  name = "multiply";
  info = "Outputs product of inputs";

  constructor(orca, x, y, passive) {
    super(orca, x, y, "m", passive);

    this.ports.a = { x: -1, y: 0 };
    this.ports.b = { x: 1, y: 0 };
    this.ports.output = { x: 0, y: 1, sensitive: true, output: true };
  }

  operation(force = false) {
    const a = this.listen(this.ports.a, true);
    const b = this.listen(this.ports.b, true);
    return this.orca.keyOf(a * b);
  }
}
