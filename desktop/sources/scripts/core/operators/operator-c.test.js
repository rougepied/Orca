import { test, vi, expect } from "vitest";
import { OperatorC } from "./operator-c.js";

test(OperatorC.name, () => {
  const orca = /** @type {import("../orca.js").Orca} */ ({
    keyOf: () => {},
    f: 12,
  });
  const x = null;
  const y = null;
  const passive = true;
  const operator = new OperatorC(orca, x, y, passive);

  const spyListen = vi.spyOn(operator, "listen").mockImplementation((cb) => {
    switch (cb) {
      case operator.ports.rate:
        return 10;
      case operator.ports.mod:
        return 3;
      default: //should never happen
        return "never";
    }
  });
  const spyKeyOf = vi.spyOn(orca, "keyOf");

  const result = operator.operation();
  expect(spyListen).toHaveBeenCalledWith(operator.ports.rate, true);
  expect(spyListen).toHaveBeenCalledWith(operator.ports.mod, true);
  expect(spyKeyOf).toHaveBeenCalledWith(1);
});
