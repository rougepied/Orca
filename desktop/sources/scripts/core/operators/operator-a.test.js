import { OperatorA } from "./operator-a.js";

import { test, vi, expect } from "vitest";

test("OperatorA#operation", () => {
  const orca = /** @type {import("../orca.js").Orca} */ ({ keyOf: () => {} });
  const x = null;
  const y = null;
  const passive = true;
  const operator = new OperatorA(orca, x, y, passive);

  const a = 2;
  const b = 3;

  const spyListen = vi
    .spyOn(operator, "listen")
    .mockImplementationOnce(() => a)
    .mockImplementationOnce(() => b);
  const spyKeyOf = vi.spyOn(orca, "keyOf");

  const result = operator.operation();
  expect(spyListen).toHaveBeenCalledWith(operator.ports.a, true);
  expect(spyListen).toHaveBeenCalledWith(operator.ports.b, true);
  expect(spyKeyOf).toHaveBeenCalledWith(a + b);
});
