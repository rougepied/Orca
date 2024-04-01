//@ts-check
import { Client } from "../client.js";
import { library } from "./library.js";

export class Orca {
  keys = "0123456789abcdefghijklmnopqrstuvwxyz".split("");

  /**
   * Default Width
   * @type {number}
   */
  w = 1; // Default Width
  h = 1; // Default Height
  f = 0; // Frame
  s = ""; // String

  locks = [];
  runtime = [];
  variables = {};

  /**
   * @param {Client} client
   */
  constructor(client) {
    this.client = client;

    this.reset();
  }

  run() {
    this.runtime = this.parse();
    this.operate(this.runtime);
    this.f += 1;
  }

  reset(w = this.w, h = this.h) {
    this.f = 0;
    this.w = w;
    this.h = h;
    this.replace(new Array(this.h * this.w + 1).join("."));
  }

  load(w, h, s, f = 0) {
    this.w = w;
    this.h = h;
    this.f = f;
    this.replace(this.clean(s));
    return this;
  }

  write(x, y, g) {
    if (!g) {
      return false;
    }
    if (g.length !== 1) {
      return false;
    }
    if (!this.inBounds(x, y)) {
      return false;
    }
    if (this.glyphAt(x, y) === g) {
      return false;
    }
    const index = this.indexAt(x, y);
    const glyph = !this.isAllowed(g) ? "." : g;
    const string = this.s.substr(0, index) + glyph + this.s.substr(index + 1);
    this.replace(string);
    return true;
  }

  clean(str) {
    return `${str}`
      .replace(/\n/g, "")
      .trim()
      .substr(0, this.w * this.h)
      .split("")
      .map((g) => {
        return !this.isAllowed(g) ? "." : g;
      })
      .join("");
  }

  replace(s) {
    this.s = s;
  }

  // Operators
  parse() {
    const a = [];
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const g = this.glyphAt(x, y);
        if (g === "." || !this.isAllowed(g)) {
          continue;
        }
        a.push(new library[g.toLowerCase()](this, x, y, g === g.toUpperCase()));
      }
    }
    return a;
  }

  operate(operators) {
    this.release();
    for (const operator of operators) {
      if (this.lockAt(operator.x, operator.y)) {
        continue;
      }
      if (operator.passive || operator.hasNeighbor("*")) {
        operator.run();
      }
    }
  }

  bounds() {
    let w = 0;
    let h = 0;
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const g = this.glyphAt(x, y);
        if (g !== ".") {
          if (x > w) {
            w = x;
          }
          if (y > h) {
            h = y;
          }
        }
      }
    }
    return { w, h };
  }

  // Blocks
  getBlock(x, y, w, h) {
    let lines = "";
    for (let _y = y; _y < y + h; _y++) {
      let line = "";
      for (let _x = x; _x < x + w; _x++) {
        line += this.glyphAt(_x, _y);
      }
      lines += `${line}\n`;
    }
    return lines;
  }

  writeBlock(x, y, block, overlap = false) {
    if (!block) {
      return;
    }
    const lines = block.split(/\r?\n/);
    let _y = y;
    for (const line of lines) {
      let _x = x;
      for (const y in line) {
        const glyph = line[y];
        this.write(
          _x,
          _y,
          overlap === true && glyph === "." ? this.glyphAt(_x, _y) : glyph,
        );
        _x++;
      }
      _y++;
    }
  }

  // Locks
  release() {
    this.locks = new Array(this.w * this.h);
    this.variables = {};
  }

  unlock(x, y) {
    this.locks[this.indexAt(x, y)] = null;
  }

  lock(x, y) {
    if (this.lockAt(x, y)) {
      return;
    }
    this.locks[this.indexAt(x, y)] = true;
  }

  // Helpers
  inBounds(x, y) {
    return (
      Number.isInteger(x) &&
      Number.isInteger(y) &&
      x >= 0 &&
      x < this.w &&
      y >= 0 &&
      y < this.h
    );
  }

  isAllowed(g) {
    return g === "." || !!library[`${g}`.toLowerCase()];
  }

  isSpecial(g) {
    return g.toLowerCase() === g.toUpperCase() && Number.isNaN(g);
  }

  keyOf(val, uc = false) {
    return uc === true
      ? this.keys[val % 36].toUpperCase()
      : this.keys[val % 36];
  }

  valueOf(g) {
    return !g || g === "." || g === "*"
      ? 0
      : this.keys.indexOf(`${g}`.toLowerCase());
  }

  indexAt(x, y) {
    return this.inBounds(x, y) === true ? x + this.w * y : -1;
  }

  operatorAt(x, y) {
    return this.runtime.filter((item) => {
      return item.x === x && item.y === y;
    })[0];
  }

  posAt(index) {
    return { x: index % this.w, y: Math.floor(index / this.w) };
  }

  glyphAt(x, y) {
    return this.s.charAt(this.indexAt(x, y));
  }

  valueAt(x, y) {
    return this.valueOf(this.glyphAt(x, y));
  }

  lockAt(x, y) {
    return this.locks[this.indexAt(x, y)] === true;
  }

  valueIn(key) {
    return this.variables[key] || ".";
  }

  // Tools
  format() {
    const a = [];
    for (let y = 0; y < this.h; y++) {
      a.push(this.s.substr(y * this.w, this.w));
    }
    return a.reduce((acc, val) => {
      return `${acc}${val}\n`;
    }, "");
  }

  length() {
    return this.strip().length;
  }

  strip() {
    return this.s.replace(/[^a-zA-Z0-9+]+/gi, "").trim();
  }

  toString() {
    return this.format().trim();
  }

  toRect(str = this.s) {
    const lines = str.trim().split(/\r?\n/);
    return { x: lines[0].length, y: lines.length };
  }
}
