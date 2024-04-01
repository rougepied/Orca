import { Operator } from "../operator";

export class OperatorD extends Operator {
  name = "delay";
  info = "Bangs on modulo of frame";

  constructor(orca, x, y, passive) {
    super(orca, x, y, "d", passive);

    this.ports.rate = { x: -1, y: 0, clamp: { min: 1 } };
    this.ports.mod = { x: 1, y: 0, default: "8" };
    this.ports.output = { x: 0, y: 1, bang: true, output: true };
  }

  operation(force = false) {
    const rate = this.listen(this.ports.rate, true);
    const mod = this.listen(this.ports.mod, true);
    const res = this.orca.f % (mod * rate);
    return res === 0 || mod === 1;
  }
}
