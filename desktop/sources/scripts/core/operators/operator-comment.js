import { Operator } from "../operator";

export class OperatorComment extends Operator {
  name = "comment";
  info = "Halts line";
  draw = false;

  constructor(orca, x, y, passive) {
    super(orca, x, y, "#", true);
  }

  operation() {
    for (let x = this.x + 1; x <= this.orca.w; x++) {
      this.orca.lock(x, this.y);
      if (this.orca.glyphAt(x, this.y) === this.glyph) {
        break;
      }
    }
    this.orca.lock(this.x, this.y);
  }
}
