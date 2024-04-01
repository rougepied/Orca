import { Operator } from "../operator";

export class OperatorK extends Operator {
  name = "konkat";
  info = "Reads multiple variables";

  constructor(orca, x, y, passive) {
    super(orca, x, y, "k", passive);

    this.ports.len = { x: -1, y: 0, clamp: { min: 1 } };
  }

  operation(force = false) {
    this.len = this.listen(this.ports.len, true);
    for (let offset = 0; offset < this.len; offset++) {
      const key = this.orca.glyphAt(this.x + offset + 1, this.y);
      this.orca.lock(this.x + offset + 1, this.y);
      if (key === ".") {
        continue;
      }
      const inPort = { x: offset + 1, y: 0 };
      const outPort = { x: offset + 1, y: 1, output: true };
      this.addPort(`in${offset}`, inPort);
      this.addPort(`out${offset}`, outPort);
      const res = this.orca.valueIn(key);
      this.output(`${res}`, outPort);
    }
  }
}
