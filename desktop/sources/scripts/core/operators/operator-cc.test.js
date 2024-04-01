import { describe, expect, test, vi } from "vitest";
import { OperatorCC } from "./operator-cc.js";

describe(OperatorCC.name, () => {
  const x = null;
  const y = null;

  describe("operation should not call listen", () => {
    test('when operator.hasNeighbor("*") return false and force === false', () => {
      const orca = /** @type {import("../orca.js").Orca} */ ({
        glyphAt: () => {},
      });

      const operator = new OperatorCC(orca, x, y);
      vi.spyOn(operator, "hasNeighbor").mockImplementation(() => false);
      vi.spyOn(operator, "listen");

      operator.operation();
      expect(operator.listen).not.toHaveBeenCalled();
      operator.operation(false);
      expect(operator.listen).not.toHaveBeenCalled();
    });
  });

  describe("operation should call listen", () => {
    const orca = /** @type {import("../orca.js").Orca} */ (
      /** @type {unknown} */ ({
        client: {
          io: { cc: { stack: [], run: () => {} } },
        },
        glyphAt: () => {},
      })
    );

    test('when operator.hasNeighbor("*") return false and force === true', () => {
      const operator = new OperatorCC(orca, x, y);
      vi.spyOn(operator, "hasNeighbor").mockImplementation(() => false);
      vi.spyOn(operator, "listen");

      operator.operation(true);
      expect(operator.listen).toHaveBeenCalled();
    });

    test('when operator.hasNeighbor("*") return true and force === false', () => {
      const operator = new OperatorCC(orca, x, y);
      vi.spyOn(operator, "hasNeighbor").mockImplementation(() => true);
      vi.spyOn(operator, "listen").mockImplementation((param) => {
        switch (param) {
          case operator.ports.channel:
            return "not .";
          case operator.ports.knob:
            return "not .";
          default: //should never happen
            return "never";
        }
      });

      operator.operation(false);
      expect(operator.listen).toHaveBeenCalledWith;
    });

    test('when operator.listen(operator.ports.channel) === ".", should not call operator.listen(operatos.ports.knob', () => {
      const operator = new OperatorCC(orca, x, y);
      vi.spyOn(operator, "hasNeighbor").mockImplementation(() => true);
      vi.spyOn(operator, "listen").mockImplementation((param) => {
        switch (param) {
          case operator.ports.channel:
            return ".";
          case operator.ports.knob:
            return "not .";
          default: //should never happen
            return "never";
        }
      });

      operator.operation(false);
      expect(operator.listen).toHaveBeenCalledWith(operator.ports.channel);
      expect(operator.listen).not.toHaveBeenCalledWith(operator.ports.knob);
    });

    test('when operator.listen(operatos.ports.knob) === "." should not call operator.listen(this.ports.channel, true)', () => {
      const operator = new OperatorCC(orca, x, y);
      vi.spyOn(operator, "hasNeighbor").mockImplementation(() => true);
      vi.spyOn(operator, "listen").mockImplementation((param) => {
        switch (param) {
          case operator.ports.channel:
            return "not .";
          case operator.ports.knob:
            return ".";
          default: //should never happen
            return "never";
        }
      });

      operator.operation(false);
      expect(operator.listen).toHaveBeenCalledWith(operator.ports.channel);
      expect(operator.listen).toHaveBeenCalledWith(operator.ports.knob);
      expect(operator.listen).not.toHaveBeenCalledWith(
        operator.ports.channel,
        true,
      );
    });

    test("", () => {
      const operator = new OperatorCC(orca, x, y);
      vi.spyOn(operator, "hasNeighbor").mockImplementation(() => true);
      vi.spyOn(operator, "listen").mockImplementation((ports) => {
        switch (ports) {
          case operator.ports.channel:
            return 16;
          case operator.ports.knob:
            return "not .";
          default: //should never happen
            return "never";
        }
      });

      operator.operation(false);
      expect(operator.listen).toHaveBeenCalledWith(operator.ports.channel);
      expect(operator.listen).toHaveBeenCalledWith(operator.ports.knob);
      expect(operator.listen).toHaveBeenCalledWith(
        operator.ports.channel,
        true,
      );
      expect(operator.listen).not.toHaveBeenCalledWith(
        operator.ports.knob,
        true,
      );
    });
  });
});
