import { Operator } from "../operator";

export class OperatorX extends Operator {
  name = "write";
  info = "Writes operand with offset";

  constructor(orca, x, y, passive) {
    super(orca, x, y, "x", passive);

    this.ports.x = { x: -2, y: 0 };
    this.ports.y = { x: -1, y: 0 };
    this.ports.val = { x: 1, y: 0 };
  }

  operation(force = false) {
    const x = this.listen(this.ports.x, true);
    const y = this.listen(this.ports.y, true) + 1;
    this.addPort("output", { x: x, y: y, output: true });
    return this.listen(this.ports.val);
  }
}
