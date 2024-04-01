import { describe, expect, test, vi } from "vitest";

import { OperatorD } from "./operator-d";

describe(OperatorD.name, () => {
  test.each`
    mod   | rate  | f
    ${1}  | ${10} | ${1}
    ${12} | ${1}  | ${110}
    ${10} | ${3}  | ${120}
    ${10} | ${3}  | ${120}
  `("operation", ({ mod, rate, f }) => {
    const orca = /** @type {import("../orca.js").Orca} */ ({ f });
    const operator = new OperatorD(orca, null, null, true);

    vi.spyOn(operator, "listen").mockImplementation((param) => {
      switch (param) {
        case operator.ports.rate:
          return rate;
        case operator.ports.mod:
          return mod;
      }
    });

    const compute = f % (mod * rate);

    const result = operator.operation();
    expect(result).toEqual(compute === 0 || mod === 1);
  });
});
