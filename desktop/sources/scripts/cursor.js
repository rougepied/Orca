//@ts-check

import { clamp } from "./clamp.js";

export class Cursor {
  client;
  x = 0;
  y = 0;
  w = 0;
  h = 0;

  minX = 0;
  maxX = 0;
  minY = 0;
  maxY = 0;

  /** @type {{x: Number, y:Number} | null} */
  mouseFrom = null;

  ins = false;

  constructor(client) {
    this.client = client;
  }

  start() {
    document.onmousedown = (evt) => this.onMouseDown(evt);
    document.onmouseup = (evt) => this.onMouseUp(evt);
    document.onmousemove = (evt) => this.onMouseMove(evt);
    document.oncopy = (evt) => this.onCopy(evt);
    document.oncut = (evt) => this.onCut(evt);
    document.onpaste = (evt) => this.onPaste(evt);
    document.oncontextmenu = (evt) => this.onContextMenu(evt);
  }

  select(x = this.x, y = this.y, w = this.w, h = this.h) {
    // biome-ignore lint/suspicious/noGlobalIsNan: <explanation>
    if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) {
      return;
    }
    const rect = {
      x: clamp(Math.floor(x), 0, this.client.orca.w - 1),
      y: clamp(Math.floor(y), 0, this.client.orca.h - 1),
      w: clamp(Math.floor(w), -this.x, this.client.orca.w - 1),
      h: clamp(Math.floor(h), -this.y, this.client.orca.h - 1),
    };

    if (
      this.x === rect.x &&
      this.y === rect.y &&
      this.w === rect.w &&
      this.h === rect.h
    ) {
      return; // Don't update when unchanged
    }

    this.x = rect.x;
    this.y = rect.y;
    this.w = rect.w;
    this.h = rect.h;
    this.calculateBounds();
    this.client.toggleGuide(false);
    this.client.update();
  }

  selectAll() {
    this.select(0, 0, this.client.orca.w, this.client.orca.h);
    this.ins = false;
  }

  move(x, y) {
    this.select(this.x + Number.parseInt(x), this.y - Number.parseInt(y));
  }

  moveTo(x, y) {
    this.select(x, y);
  }

  scale(w, h) {
    this.select(
      this.x,
      this.y,
      this.w + Number.parseInt(w),
      this.h - Number.parseInt(h),
    );
  }

  scaleTo(w, h) {
    this.select(this.x, this.y, w, h);
  }

  drag(x, y) {
    if (Number.isNaN(x) || Number.isNaN(y)) {
      return;
    }
    this.ins = false;
    const block = this.selection();
    this.erase();
    this.move(x, y);
    this.client.orca.writeBlock(this.minX, this.minY, block);
    this.client.history.record(this.client.orca.s);
  }

  reset(pos = false) {
    this.select(pos ? 0 : this.x, pos ? 0 : this.y, 0, 0);
    this.ins = false;
  }

  read() {
    return this.client.orca.glyphAt(this.x, this.y);
  }

  write(g) {
    if (!this.client.orca.isAllowed(g)) {
      return;
    }
    if (this.client.orca.write(this.x, this.y, g) && this.ins) {
      this.move(1, 0);
    }
    this.client.history.record(this.client.orca.s);
  }

  erase() {
    for (let y = this.minY; y <= this.maxY; y++) {
      for (let x = this.minX; x <= this.maxX; x++) {
        this.client.orca.write(x, y, ".");
      }
    }
    this.client.history.record(this.client.orca.s);
  }

  find(str) {
    const i = this.client.orca.s.indexOf(str);
    if (i < 0) {
      return;
    }
    const pos = this.client.orca.posAt(i);
    this.select(pos.x, pos.y, str.length - 1, 0);
  }

  inspect() {
    if (this.w !== 0 || this.h !== 0) {
      return "multi";
    }
    const index = this.client.orca.indexAt(this.x, this.y);
    const port = this.client.ports[index];
    if (port) {
      return `${port[3]}`;
    }
    if (this.client.orca.lockAt(this.x, this.y)) {
      return "locked";
    }
    return "empty";
  }

  trigger() {
    const operator = this.client.orca.operatorAt(this.x, this.y);
    if (!operator) {
      console.warn("Cursor", "Nothing to trigger.");
      return;
    }
    console.log("Cursor", `Trigger: ${operator.name}`);
    operator.run(true);
  }

  comment() {
    const block = this.selection();
    const lines = block.trim().split(/\r?\n/);
    const char = block.substr(0, 1) === "#" ? "." : "#";
    const res = lines
      .map((line) => {
        return `${char}${line.substr(1, line.length - 2)}${char}`;
      })
      .join("\n");
    this.client.orca.writeBlock(this.minX, this.minY, res);
    this.client.history.record(this.client.orca.s);
  }

  toUpperCase() {
    const block = this.selection().toUpperCase();
    this.client.orca.writeBlock(this.minX, this.minY, block);
  }

  toLowerCase() {
    const block = this.selection().toLowerCase();
    this.client.orca.writeBlock(this.minX, this.minY, block);
  }

  toRect() {
    return {
      x: this.minX,
      y: this.minY,
      w: this.maxX - this.minX + 1,
      h: this.maxY - this.minY + 1,
    };
  }

  calculateBounds() {
    this.minX = this.x < this.x + this.w ? this.x : this.x + this.w;
    this.minY = this.y < this.y + this.h ? this.y : this.y + this.h;
    this.maxX = this.x > this.x + this.w ? this.x : this.x + this.w;
    this.maxY = this.y > this.y + this.h ? this.y : this.y + this.h;
  }

  selected(x, y, w = 0, h = 0) {
    return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY;
  }

  selection(rect = this.toRect()) {
    return this.client.orca.getBlock(rect.x, rect.y, rect.w, rect.h);
  }

  onMouseDown(e) {
    if (e.button !== 0) {
      this.cut();
      return;
    }
    const pos = this.mousePick(e.clientX, e.clientY);
    this.select(pos.x, pos.y, 0, 0);
    this.mouseFrom = pos;
  }

  onMouseMove(e) {
    if (!this.mouseFrom) {
      return;
    }
    const pos = this.mousePick(e.clientX, e.clientY);
    this.select(
      this.mouseFrom.x,
      this.mouseFrom.y,
      pos.x - this.mouseFrom.x,
      pos.y - this.mouseFrom.y,
    );
  }

  onMouseUp(e) {
    if (this.mouseFrom) {
      const pos = this.mousePick(e.clientX, e.clientY);
      this.select(
        this.mouseFrom.x,
        this.mouseFrom.y,
        pos.x - this.mouseFrom.x,
        pos.y - this.mouseFrom.y,
      );
    }
    this.mouseFrom = null;
  }

  mousePick(x, y, w = this.client.tile.w, h = this.client.tile.h) {
    return { x: Math.floor((x - 30) / w), y: Math.floor((y - 30) / h) };
  }

  onContextMenu(e) {
    e.preventDefault();
  }

  copy() {
    document.execCommand("copy");
  }

  cut() {
    document.execCommand("cut");
  }

  paste(overlap = false) {
    document.execCommand("paste");
  }

  onCopy(e) {
    e.clipboardData.setData("text/plain", this.selection());
    e.preventDefault();
  }

  onCut(e) {
    this.onCopy(e);
    this.erase();
  }

  onPaste(e) {
    const data = e.clipboardData.getData("text/plain").trim();
    this.client.orca.writeBlock(this.minX, this.minY, data, this.ins);
    this.client.history.record(this.client.orca.s);
    this.scaleTo(
      data.split(/\r?\n/)[0].length - 1,
      data.split(/\r?\n/).length - 1,
    );
    e.preventDefault();
  }
}
