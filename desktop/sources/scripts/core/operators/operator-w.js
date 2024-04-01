import { Operator } from "../operator";

export class OperatorW extends Operator {
  name = "west";
  info = "Moves westward, or bangs";

  constructor(orca, x, y, passive) {
    super(orca, x, y, "w", passive);
    this.draw = false;
  }

  operation() {
    this.move(-1, 0);
    this.passive = false;
  }
}
