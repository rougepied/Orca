import { Operator } from "../operator";

export class OperatorF extends Operator {
  name = "if";
  info = "Bangs if inputs are equal";

  constructor(orca, x, y, passive) {
    super(orca, x, y, "f", passive);

    this.ports.a = { x: -1, y: 0 };
    this.ports.b = { x: 1, y: 0 };
    this.ports.output = { x: 0, y: 1, bang: true, output: true };
  }

  operation(force = false) {
    const a = this.listen(this.ports.a);
    const b = this.listen(this.ports.b);
    return a === b;
  }
}
