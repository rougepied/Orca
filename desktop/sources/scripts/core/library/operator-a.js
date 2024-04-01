import { Operator } from "../operator";

export class OperatorA extends Operator {
  /**
   * @param {import("../orca").Orca} orca
   * @param {*} x
   * @param {*} y
   * @param {*} passive
   */
  constructor(orca, x, y, passive) {
    super(orca, x, y, "a", passive);

    this.name = "add";
    this.info = "Outputs sum of inputs";

    this.ports.a = { x: -1, y: 0 };
    this.ports.b = { x: 1, y: 0 };
    this.ports.output = { x: 0, y: 1, sensitive: true, output: true };
  }

  operation(force = false) {
    const a = this.listen(this.ports.a, true);
    const b = this.listen(this.ports.b, true);
    return this.orca.keyOf(a + b);
  }
}
