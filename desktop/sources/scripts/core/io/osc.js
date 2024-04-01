//@ts-check

/*
Osc not supported in browser
*/
// const osc = require("node-osc");

export class Osc {
  stack = [];
  /** @type {osc.Client | null} */
  socket = null;
  /** @type {Number | null} */
  port = null;
  options = {
    default: 49162,
    tidalCycles: 6010,
    sonicPi: 4559,
    superCollider: 57120,
    norns: 10111,
  };

  client;

  constructor(client) {
    this.client = client;
  }

  start() {
    if (!osc) {
      console.warn("OSC", "Could not start.");
      return;
    }
    console.info("OSC", "Starting..");
    this.setup();
    this.select();
  }

  clear() {
    this.stack = [];
  }

  run() {
    for (const item of this.stack) {
      this.play(item);
    }
  }

  push(path, msg) {
    this.stack.push({ path, msg });
  }

  play({ path, msg }) {
    if (!this.socket) {
      console.warn("OSC", "Unavailable socket");
      return;
    }
    const oscMsg = new osc.Message(path);
    for (let i = 0; i < msg.length; i++) {
      oscMsg.append(this.client.orca.valueOf(msg.charAt(i)));
    }
    this.socket.send(oscMsg, (err) => {
      if (err) {
        console.warn(err);
      }
    });
  }

  select(port = this.options.default) {
    if (Number(port) === this.port) {
      console.warn("OSC", "Already selected");
      return;
    }
    if (Number.isNaN(port) || port < 1000) {
      console.warn("OSC", "Unavailable port");
      return;
    }
    console.info("OSC", `Selected port: ${port}`);
    this.port = Number(port);
    this.setup();
  }

  setup() {
    if (!this.port) {
      return;
    }
    if (this.socket) {
      this.socket.close();
    }
    this.socket = new osc.Client(this.client.io.ip, this.port);
    console.info("OSC", `Started socket at ${this.client.io.ip}:${this.port}`);
  }
}
