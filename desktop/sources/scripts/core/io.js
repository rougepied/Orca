//@ts-check

import { MidiCC } from "./io/cc.js";
import { Midi } from "./io/midi.js";
import { Mono } from "./io/mono.js";
import { Osc } from "./io/osc.js";
import { Udp } from "./io/udp.js";

export class IO {
  constructor(client) {
    this.client = client;
    this.ip = "127.0.0.1";

    this.midi = new Midi(client);
    this.cc = new MidiCC(client);
    this.mono = new Mono(client);
    this.udp = new Udp(client);
    this.osc = new Osc(client);
  }

  start() {
    this.midi.start();
    this.cc.start();
    this.mono.start();
    this.udp.start();
    this.osc.start();
    this.clear();
  }

  clear() {
    this.midi.clear();
    this.cc.clear();
    this.mono.clear();
    this.udp.clear();
    this.osc.clear();
  }

  run() {
    this.midi.run();
    this.cc.run();
    this.mono.run();
    this.udp.run();
    this.osc.run();
  }

  silence() {
    this.midi.silence();
    this.mono.silence();
  }

  setIp(addr = "127.0.0.1") {
    if (validateIP(addr) !== true && addr.indexOf(".local") === -1) {
      console.warn("IO", "Invalid IP");
      return;
    }
    this.ip = addr;
    console.log("IO", "Set target IP to " + this.ip);
    this.osc.setup();
  }

  length() {
    return (
      this.midi.length() +
      this.mono.length() +
      this.cc.stack.length +
      this.udp.stack.length +
      this.osc.stack.length
    );
  }

  inspect(limit = this.client.grid.w) {
    let text = "";
    for (let i = 0; i < this.length(); i++) {
      text += "|";
    }
    return fill(text, limit, ".");
  }
}
function validateIP(addr) {
  return !!/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
    addr
  );
}
function fill(str, len, chr) {
  while (str.length < len) {
    str += chr;
  }
  return str;
}
