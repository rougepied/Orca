import { beforeEach, describe, expect, it, test, vi } from "vitest";
import { Operator } from "./operator.js";

describe("Operator#listen", () => {
  it(`return "." or 0 with no port`, () => {
    const orca = /** @type {import("./orca.js").Orca} */ ({ keyOf: () => {} });
    const x = null;
    const y = null;
    const operator = new Operator(orca, x, y);

    let result = operator.listen(null);
    expect(result).toEqual(".");

    result = operator.listen(null, false);
    expect(result).toEqual(".");

    result = operator.listen(null, true);
    expect(result).toEqual(0);
  });

  test("Operator#listen ", () => {
    const orca = /** @type {import("./orca.js").Orca} */ ({
      glyphAt: () => {},
    });
    const x = null;
    const y = null;

    const spyGlyphAt = vi.spyOn(orca, "glyphAt").mockImplementation(() => "g");
    const spyValueOf = vi.spyOn(orca, "valueOf").mockImplementation(() => 11);

    const operator = new Operator(orca, x, y);

    const port = { clamp: { min: 10, max: 12 } };
    const result = operator.listen(port, true);

    expect(result).toEqual(11);
    expect(spyGlyphAt).toHaveBeenCalled();
    expect(spyValueOf).toHaveBeenCalled();
  });
});
