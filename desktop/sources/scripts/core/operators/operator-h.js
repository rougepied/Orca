import { Operator } from "../operator";

export class OperatorH extends Operator {
  name = "halt";
  info = "Halts southward operand";

  constructor(orca, x, y, passive) {
    super(orca, x, y, "h", passive);

    this.ports.output = { x: 0, y: 1, reader: true, output: true };
  }

  operation(force = false) {
    this.orca.lock(this.x + this.ports.output.x, this.y + this.ports.output.y);
    return this.listen(this.ports.output, true);
  }
}
