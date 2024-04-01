import { Operator } from "../operator";

export class OperatorU extends Operator {
  name = "uclid";
  info = "Bangs on Euclidean rhythm";

  constructor(orca, x, y, passive) {
    super(orca, x, y, "u", passive);

    this.ports.step = { x: -1, y: 0, clamp: { min: 0 }, default: "1" };
    this.ports.max = { x: 1, y: 0, clamp: { min: 1 }, default: "8" };
    this.ports.output = { x: 0, y: 1, bang: true, output: true };
  }

  operation(force = false) {
    const step = this.listen(this.ports.step, true);
    const max = this.listen(this.ports.max, true);
    const bucket = ((step * (this.orca.f + max - 1)) % max) + step;
    return bucket >= max;
  }
}
