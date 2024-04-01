import { Operator } from "../operator";

export class OperatorSelf extends Operator {
  name = "self";
  info = "Sends ORCA command";

  constructor(orca, x, y, passive) {
    super(orca, x, y, "*", true);
  }

  run(force = false) {
    let msg = "";
    for (let x = 1; x <= 36; x++) {
      const g = this.orca.glyphAt(this.x + x, this.y);
      this.orca.lock(this.x + x, this.y);
      if (g === ".") {
        break;
      }
      msg += g;
    }

    if (!this.hasNeighbor("*") && force === false) {
      return;
    }
    if (msg === "") {
      return;
    }

    this.draw = false;
    this.orca.client.commander.trigger(
      `${msg}`,
      { x: this.x, y: this.y + 1 },
      false,
    );
  }
}
