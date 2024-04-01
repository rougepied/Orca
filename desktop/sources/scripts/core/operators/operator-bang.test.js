import { describe, expect, test, vi } from "vitest";
import { OperatorBang } from "./operator-bang.js";

describe(OperatorBang.name, () => {
  test("run should call erase()", () => {
    const orca = /** @type {import("../orca.js").Orca} */ ({ write: () => {} });
    const x = null;
    const y = null;
    const passive = true;

    const operator = new OperatorBang(orca, x, y, passive);
    vi.spyOn(orca, "write");
    vi.spyOn(operator, "erase");

    operator.run();

    expect(orca.write).toHaveBeenCalled();
    expect(operator.erase).toHaveBeenCalled();
  });
});
