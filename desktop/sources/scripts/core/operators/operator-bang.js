import { Operator } from "../operator";

export class OperatorBang extends Operator {
  name = "bang";
  info = "Bangs neighboring operands";
  draw = false;

  constructor(orca, x, y, passive) {
    super(orca, x, y, "*", true);
  }

  run(_force = false) {
    this.draw = false;
    this.erase();
  }
}
