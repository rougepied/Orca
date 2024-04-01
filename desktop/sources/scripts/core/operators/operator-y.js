import { Operator } from "../operator";

export class OperatorY extends Operator {
  name = "jymper";
  info = "Outputs westward operand";

  constructor(orca, x, y, passive) {
    super(orca, x, y, "y", passive);
  }

  operation(force = false) {
    const val = this.listen({ x: -1, y: 0, output: true });
    if (val !== this.glyph) {
      let i = 0;
      while (this.orca.inBounds(this.x + i, this.y)) {
        if (this.listen({ x: ++i, y: 0 }) !== this.glyph) {
          break;
        }
      }
      this.addPort("input", { x: -1, y: 0 });
      this.addPort("output", { x: i, y: 0, output: true });
      return val;
    }
  }
}
