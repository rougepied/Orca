//@ts-check

export class History {
  constructor() {
    this.index = 0;
    this.frames = [];
    this.host = null;
    this.key = null;
  }

  bind(host, key) {
    console.log("History is recording..");
    this.host = host;
    this.key = key;
    this.reset();
  }

  reset() {
    this.index = 0;
    this.frames = [];
  }

  record(data) {
    if (this.index === this.frames.length) {
      this.append(data);
    } else {
      this.fork(data);
    }
    this.trim();
    this.index = this.frames.length;
  }

  undo() {
    if (this.index === 0) {
      console.warn("History", "Reached beginning");
      return;
    }
    this.index = clamp(this.index - 1, 0, this.frames.length - 2);
    this.apply(this.frames[this.index]);
  }

  redo() {
    if (this.index + 1 > this.frames.length - 1) {
      console.warn("History", "Reached end");
      return;
    }
    this.index = clamp(this.index + 1, 0, this.frames.length - 1);
    this.apply(this.frames[this.index]);
  }

  apply(f) {
    if (!this.host[this.key]) {
      console.log(`Unknown binding to key ${this.key}`);
      return;
    }
    if (!f || f.length !== this.host[this.key].length) {
      return;
    }
    this.host[this.key] = this.frames[this.index];
  }

  append(data) {
    if (!data) {
      return;
    }
    if (this.frames[this.index - 1] && this.frames[this.index - 1] === data) {
      return;
    }
    this.frames.push(data);
  }

  fork(data) {
    this.frames = this.frames.slice(0, this.index + 1);
    this.append(data);
  }

  trim(limit = 30) {
    if (this.frames.length < limit) {
      return;
    }
    this.frames.shift();
  }

  last() {
    return this.frames[this.index - 1];
  }

  length() {
    return this.frames.length;
  }
}

function clamp(v, min, max) {
  return v < min ? min : v > max ? max : v;
}
