import { Operator } from "../operator";

export class OperatorT extends Operator {
  name = "track";
  info = "Reads eastward operand";

  constructor(orca, x, y, passive) {
    super(orca, x, y, "t", passive);

    this.ports.key = { x: -2, y: 0 };
    this.ports.len = { x: -1, y: 0, clamp: { min: 1 } };
    this.ports.output = { x: 0, y: 1, output: true };
  }

  operation(force = false) {
    const len = this.listen(this.ports.len, true);
    const key = this.listen(this.ports.key, true);
    for (let offset = 0; offset < len; offset++) {
      this.orca.lock(this.x + offset + 1, this.y);
    }
    this.ports.val = { x: (key % len) + 1, y: 0 };
    return this.listen(this.ports.val);
  }
}
