import { Operator } from "../operator.js";

export class OperatorB extends Operator {
  name = "subtract";
  info = "Outputs difference of inputs";

  /**
   * @param {import("../orca").Orca} orca
   * @param {*} x x coordinate of the Operator
   * @param {*} y y coordinate of the Operator
   * @param {*} passive
   */
  constructor(orca, x, y, passive) {
    super(orca, x, y, "b", passive);

    this.ports.a = { x: -1, y: 0 };
    this.ports.b = { x: 1, y: 0 };
    this.ports.output = { x: 0, y: 1, sensitive: true, output: true };
  }

  operation(_force = false) {
    const a = this.listen(this.ports.a, true);
    const b = this.listen(this.ports.b, true);
    return this.orca.keyOf(Math.abs(b - a));
  }
}
