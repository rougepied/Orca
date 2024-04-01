import { Operator } from "../operator";

export class OperatorL extends Operator {
  name = "lesser";
  info = "Outputs smallest input";

  constructor(orca, x, y, passive) {
    super(orca, x, y, "l", passive);

    this.ports.a = { x: -1, y: 0 };
    this.ports.b = { x: 1, y: 0 };
    this.ports.output = { x: 0, y: 1, sensitive: true, output: true };
  }

  operation(force = false) {
    const a = this.listen(this.ports.a);
    const b = this.listen(this.ports.b);
    return a !== "." && b !== "."
      ? this.orca.keyOf(Math.min(this.orca.valueOf(a), this.orca.valueOf(b)))
      : ".";
  }
}
