import { Operator } from "../operator";

export class OperatorV extends Operator {
  name = "variable";
  info = "Reads and writes variable";

  constructor(orca, x, y, passive) {
    super(orca, x, y, "v", passive);

    this.ports.write = { x: -1, y: 0 };
    this.ports.read = { x: 1, y: 0 };
  }

  operation(force = false) {
    const write = this.listen(this.ports.write);
    const read = this.listen(this.ports.read);
    if (write === "." && read !== ".") {
      this.addPort("output", { x: 0, y: 1, output: true });
    }
    if (write !== ".") {
      this.orca.variables[write] = read;
      return;
    }
    return this.orca.valueIn(read);
  }
}
