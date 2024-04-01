import { clamp } from "./clamp.js";
import { describe, expect, test } from "vitest";

test.each`
  v    | min  | max  | expected
  ${1} | ${3} | ${5} | ${3}
  ${2} | ${3} | ${5} | ${3}
  ${3} | ${3} | ${5} | ${3}
  ${4} | ${3} | ${5} | ${4}
  ${5} | ${3} | ${5} | ${5}
  ${6} | ${3} | ${5} | ${5}
`("clamp", ({ v, min, max, expected }) => {
  const result = clamp(v, min, max);
  expect(result).toEqual(expected);
});
