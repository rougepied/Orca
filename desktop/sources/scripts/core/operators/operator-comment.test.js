import { describe, expect, test, vi } from "vitest";
import { OperatorComment } from "./operator-comment.js";

describe(OperatorComment.name, () => {
  test("operation should call lock() for every cell befor # glyph", () => {
    const sharpCharPosition = 12;
    const orca = /** @type {import("../orca.js").Orca} */ ({
      // max col of the Orca screen
      w: 36,
      lock: () => {},
      glyphAt: () => {},
    });
    const x = 9;
    const y = 1;
    const passive = true;

    const operator = new OperatorComment(orca, x, y, passive);
    vi.spyOn(orca, "lock");
    vi.spyOn(orca, "glyphAt").mockImplementation((paramX) => {
      if (paramX === sharpCharPosition) {
        return operator.glyph;
      }
      return ".";
    });

    const result = operator.operation();

    for (let i = x + 1; i <= orca.w; i++) {
      if (i <= sharpCharPosition) {
        expect(orca.lock).toHaveBeenCalledWith(i, y);
      } else {
        expect(orca.lock).not.toHaveBeenCalledWith(i, y);
      }
    }
    expect(orca.lock).toHaveBeenCalledWith(operator.x, operator.y);
  });
});
