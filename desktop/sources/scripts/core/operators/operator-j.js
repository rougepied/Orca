import { Operator } from "../operator";

export class OperatorJ extends Operator {
  name = "jumper";
  info = "Outputs northward operand";

  constructor(orca, x, y, passive) {
    super(orca, x, y, "j", passive);
  }

  operation(force = false) {
    const val = this.listen({ x: 0, y: -1 });
    if (val !== this.glyph) {
      let i = 0;
      while (this.orca.inBounds(this.x, this.y + i)) {
        if (this.listen({ x: 0, y: ++i }) !== this.glyph) {
          break;
        }
      }
      this.addPort("input", { x: 0, y: -1 });
      this.addPort("output", { x: 0, y: i, output: true });
      return val;
    }
  }
}
