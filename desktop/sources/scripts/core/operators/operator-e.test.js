import { describe, expect, test, vi } from "vitest";
import { OperatorE } from "./operator-e";

describe(OperatorE.name, () => {
  test("operation", () => {
    const orca = /** @type {import("../orca.js").Orca} */ ({});
    const operator = new OperatorE(orca, null, null, true);

    vi.spyOn(operator, "move").mockImplementation(() => {});
    expect(operator.passive).toBeTruthy();

    operator.operation();

    expect(operator.move).toHaveBeenCalled();
    expect(operator.passive).toBeFalsy();
  });
});
