//@ts-check

import { MidiCC } from "./io/cc.js";
import { Midi } from "./io/midi.js";
import { Mono } from "./io/mono.js";
// import { Udp } from "./io/udp.js";
// import { Osc } from "./io/osc.js";

/* global Udp */
/* global Osc */

export class IO {
  client;
  midi;
  cc;
  mono;
  ip = "127.0.0.1";

  constructor(client) {
    this.client = client;

    this.midi = new Midi(client);
    this.cc = new MidiCC(client);
    this.mono = new Mono(client);
    this.osc = undefined;
    //  this.udp = new Udp(client);
    //  this.osc = new Osc(client);
  }

  start() {
    this.midi.start();
    this.cc.start();
    this.mono.start();
    //    this.udp.start();
    //    this.osc.start();
    this.clear();
  }

  clear() {
    this.midi.clear();
    this.cc.clear();
    this.mono.clear();
    //    this.udp.clear();
    //    this.osc.clear();
  }

  run() {
    this.midi.run();
    this.cc.run();
    // this.mono.run();
    // this.udp.run();
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
    console.log("IO", `Set target IP to ${this.ip}`);
    // this.osc.setup();
  }

  length() {
    return (
      this.midi.length() + this.mono.length() + this.cc.stack.length //+
      // this.udp.stack.length +
      // this.osc.stack.length
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
    addr,
  );
}
function fill(str, len, chr) {
  let response = str;
  while (response.length < len) {
    response += chr;
  }
  return response;
}
