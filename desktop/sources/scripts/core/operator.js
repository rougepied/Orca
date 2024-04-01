//@ts-check

import { Orca } from "./orca.js";

export class Operator {
  /**
   * @param {Orca} orca 
   * @param {*} x 
   * @param {*} y 
   * @param {*} glyph 
   * @param {*} passive 
   */
  constructor(orca, x, y, glyph = ".", passive = false) {
    this.orca = orca;
    this.name = "unknown";
    this.x = x;
    this.y = y;
    this.passive = passive;
    this.draw = passive;
    this.glyph = passive ? glyph.toUpperCase() : glyph;
    this.info = "--";
    this.ports = {};
  }

  // Actions
  listen(port, toValue = false) {
    if (!port) {
      return toValue ? 0 : ".";
    }
    const g = this.orca.glyphAt(this.x + port.x, this.y + port.y);
    const glyph = (g === "." || g === "*") && port.default ? port.default : g;
    if (toValue) {
      const min = port.clamp && port.clamp.min ? port.clamp.min : 0;
      const max = port.clamp && port.clamp.max ? port.clamp.max : 36;
      return clamp(this.orca.valueOf(glyph), min, max);
    }
    return glyph;
  }

  output(g, port = this.ports.output) {
    if (!port) {
      console.warn(this.name, "Trying to output, but no port");
      return;
    }
    if (!g) {
      return;
    }
    this.orca.write(
      this.x + port.x,
      this.y + port.y,
      this.shouldUpperCase() === true ? `${g}`.toUpperCase() : g
    );
  }

  bang(b) {
    if (!this.ports.output) {
      console.warn(this.name, "Trying to bang, but no port");
      return;
    }
    this.orca.write(
      this.x + this.ports.output.x,
      this.y + this.ports.output.y,
      b ? "*" : "."
    );
    this.orca.lock(this.x + this.ports.output.x, this.y + this.ports.output.y);
  }

  // Phases
  run() {
    // Operate
    const payload = this.operation();
    // Permissions
    for (const port of Object.values(this.ports)) {
      if (port.bang) {
        continue;
      }
      this.orca.lock(this.x + port.x, this.y + port.y);
    }

    if (this.ports.output) {
      if (this.ports.output.bang === true) {
        this.bang(payload);
      } else {
        this.output(payload);
      }
    }
  }

  operation() {
    // Used in individual operators
  }

  // Helpers
  lock() {
    this.orca.lock(this.x, this.y);
  }

  replace(g) {
    this.orca.write(this.x, this.y, g);
  }

  erase() {
    this.replace(".");
  }

  explode() {
    this.replace("*");
  }

  move(x, y) {
    const offset = { x: this.x + x, y: this.y + y };
    if (!this.orca.inBounds(offset.x, offset.y)) {
      this.explode();
      return;
    }
    if (this.orca.glyphAt(offset.x, offset.y) !== ".") {
      this.explode();
      return;
    }
    this.erase();
    this.x += x;
    this.y += y;
    this.replace(this.glyph);
    this.lock();
  }

  hasNeighbor(g) {
    if (this.orca.glyphAt(this.x + 1, this.y) === g) {
      return true;
    }
    if (this.orca.glyphAt(this.x - 1, this.y) === g) {
      return true;
    }
    if (this.orca.glyphAt(this.x, this.y + 1) === g) {
      return true;
    }
    if (this.orca.glyphAt(this.x, this.y - 1) === g) {
      return true;
    }
    return false;
  }

  // Docs
  addPort(name, pos) {
    this.ports[name] = pos;
  }

  getPorts() {
    const a = [];
    if (this.draw === true) {
      a.push([
        this.x,
        this.y,
        0,
        `${
          this.name.charAt(0).toUpperCase() +
          this.name.substring(1).toLowerCase()
        }`,
      ]);
    }
    if (!this.passive) {
      return a;
    }
    for (const id in this.ports) {
      const port = this.ports[id];
      const type = port.output ? 3 : port.x < 0 || port.y < 0 ? 1 : 2;
      a.push([this.x + port.x, this.y + port.y, type, `${this.glyph}-${id}`]);
    }
    return a;
  }

  shouldUpperCase(ports = this.ports) {
    if (!this.ports.output || !this.ports.output.sensitive) {
      return false;
    }
    const value = this.listen({ x: 1, y: 0 });
    if (value.toLowerCase() === value.toUpperCase()) {
      return false;
    }
    if (value.toUpperCase() !== value) {
      return false;
    }
    return true;
  }
}

// Docs
function clamp(v, min, max) {
  return v < min ? min : v > max ? max : v;
}