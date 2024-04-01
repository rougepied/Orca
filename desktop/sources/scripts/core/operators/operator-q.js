import { Operator } from "../operator";

export class OperatorQ extends Operator {
  name = "query";
  info = "Reads operands with offset";

  constructor(orca, x, y, passive) {
    super(orca, x, y, "q", passive);

    this.ports.x = { x: -3, y: 0 };
    this.ports.y = { x: -2, y: 0 };
    this.ports.len = { x: -1, y: 0, clamp: { min: 1 } };
  }

  operation(force = false) {
    const len = this.listen(this.ports.len, true);
    const x = this.listen(this.ports.x, true);
    const y = this.listen(this.ports.y, true);
    for (let offset = 0; offset < len; offset++) {
      const inPort = { x: x + offset + 1, y: y };
      const outPort = { x: offset - len + 1, y: 1, output: true };
      this.addPort(`in${offset}`, inPort);
      this.addPort(`out${offset}`, outPort);
      const res = this.listen(inPort);
      this.output(`${res}`, outPort);
    }
  }
}
