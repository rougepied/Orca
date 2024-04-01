import { Operator } from "../operator";

export class OperatorNull extends Operator {
  name = "null";
  info = "empty";

  constructor(orca, x, y, passive) {
    super(orca, x, y, ".", false);
  }

  // Overwrite run, to disable draw.
  run(force = false) {}
}
