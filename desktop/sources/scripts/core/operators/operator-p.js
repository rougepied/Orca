import { Operator } from "../operator";

export class OperatorP extends Operator {
  name = "push";
  info = "Writes eastward operand";

  constructor(orca, x, y, passive) {
    super(orca, x, y, "p", passive);

    this.ports.key = { x: -2, y: 0 };
    this.ports.len = { x: -1, y: 0, clamp: { min: 1 } };
    this.ports.val = { x: 1, y: 0 };
  }

  operation(force = false) {
    const len = this.listen(this.ports.len, true);
    const key = this.listen(this.ports.key, true);
    for (let offset = 0; offset < len; offset++) {
      this.orca.lock(this.x + offset, this.y + 1);
    }
    this.ports.output = { x: key % len, y: 1, output: true };
    return this.listen(this.ports.val);
  }
}
