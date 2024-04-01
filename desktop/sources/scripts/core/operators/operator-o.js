import { Operator } from "../operator";

export class OperatorO extends Operator {
  name = "read";
  info = "Reads operand with offset";

  constructor(orca, x, y, passive) {
    super(orca, x, y, "o", passive);

    this.ports.x = { x: -2, y: 0 };
    this.ports.y = { x: -1, y: 0 };
    this.ports.output = { x: 0, y: 1, output: true };
  }

  operation(force = false) {
    const x = this.listen(this.ports.x, true);
    const y = this.listen(this.ports.y, true);
    this.addPort("read", { x: x + 1, y: y });
    return this.listen(this.ports.read);
  }
}
