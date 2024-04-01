import { Operator } from "../operator";

export class OperatorOsc extends Operator {
  name = "osc";
  info = "Sends OSC message";

  constructor(orca, x, y, passive) {
    super(orca, x, y, "=", true);

    this.ports.path = { x: 1, y: 0 };
  }

  operation(force = false) {
    let msg = "";
    for (let x = 2; x <= 36; x++) {
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

    const path = this.listen(this.ports.path);

    if (!path || path === ".") {
      return;
    }

    this.draw = false;
    this.orca.client.io.osc.push(`/${path}`, msg);

    if (force === true) {
      this.orca.client.io.osc.run();
    }
  }
}
