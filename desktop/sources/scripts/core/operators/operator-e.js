import { Operator } from "../operator";

export class OperatorE extends Operator {
  name = "east";
  info = "Moves eastward, or bangs";

  constructor(orca, x, y, passive) {
    super(orca, x, y, "e", passive);

    this.draw = false;
  }

  operation() {
    this.move(1, 0);
    this.passive = false;
  }
}
