import { Operator } from "../operator";

export class OperatorS extends Operator {
  name = "south";
  info = "Moves southward, or bangs";

  constructor(orca, x, y, passive) {
    super(orca, x, y, "s", passive);

    this.draw = false;
  }

  operation() {
    this.move(0, 1);
    this.passive = false;
  }
}
