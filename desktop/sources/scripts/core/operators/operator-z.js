import { Operator } from "../operator";

export class OperatorZ extends Operator {
  name = "lerp";
  info = "Transitions operand to target";

  constructor(orca, x, y, passive) {
    super(orca, x, y, "z", passive);

    this.ports.rate = { x: -1, y: 0, default: "1" };
    this.ports.target = { x: 1, y: 0 };
    this.ports.output = {
      x: 0,
      y: 1,
      sensitive: true,
      reader: true,
      output: true,
    };
  }

  operation(force = false) {
    const rate = this.listen(this.ports.rate, true);
    const target = this.listen(this.ports.target, true);
    const val = this.listen(this.ports.output, true);
    const mod =
      val <= target - rate ? rate : val >= target + rate ? -rate : target - val;
    return this.orca.keyOf(val + mod);
  }
}
