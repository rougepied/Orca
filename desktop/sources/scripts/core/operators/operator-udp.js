import { Operator } from "../operator";

export class OperatorUdp extends Operator {
  name = "udp";
  info = "Sends UDP message";

  constructor(orca, x, y, passive) {
    super(orca, x, y, ";", true);
  }

  operation(force = false) {
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

    this.draw = false;
    // this.orca.client.io.udp.push(msg);

    if (force === true) {
      // this.orca.client.io.udp.run();
    }
  }
}
