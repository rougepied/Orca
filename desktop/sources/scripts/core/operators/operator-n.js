import { Operator } from "../operator";

export class OperatorN extends Operator {
  name = "north";
  info = "Moves Northward, or bangs";
  draw = false;

  constructor(orca, x, y, passive) {
    super(orca, x, y, "n", passive);
  }

  operation() {
    this.move(0, -1);
    this.passive = false;
  }
}
