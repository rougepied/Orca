import { describe, expect, test, vi } from "vitest";
import { OperatorF } from "./operator-f.js";

describe(OperatorF.name, () => {
  test.each`
    a        | b        | expected
    ${"a"}   | ${"b"}   | ${false}
    ${"f"}   | ${"f"}   | ${true}
    ${true}  | ${false} | ${false}
    ${false} | ${false} | ${true}
    ${3}     | ${5}     | ${false}
    ${9}     | ${9}     | ${true}
  `("operation", ({ a, b, expected }) => {
    const orca = /** @type {import("../orca.js").Orca} */ ({});
    const operator = new OperatorF(orca, null, null, true);

    vi.spyOn(operator, "listen").mockImplementation((param) => {
      switch (param) {
        case operator.ports.a:
          return a;
        case operator.ports.b:
          return b;
      }
    });

    const result = operator.operation();
    expect(result).toEqual(expected);
  });
});
