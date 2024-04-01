//@ts-check

import { clamp } from "../../clamp.js";
import { transposeTable } from "../transpose.js";

export class Midi {
  client;
  ticks = [];
  mode = 0;
  outputIndex = -1;
  isClock = false;
  inputIndex = -1;

  outputs = [];
  inputs = [];
  stack = [];

  constructor(client) {
    this.client = client;
  }

  start() {
    console.info("Midi Starting..");
    this.refresh();
  }

  clear() {
    this.stack = this.stack.filter((item) => {
      return item;
    });
  }

  run() {
    for (const id in this.stack) {
      const item = this.stack[id];
      if (item.isPlayed === false) {
        this.press(item);
      }
      if (item.length < 1) {
        this.release(item, id);
      } else {
        item.length--;
      }
    }
  }

  trigger(item, down) {
    if (!this.outputDevice()) {
      console.warn("MIDI", "No midi output!");
      return;
    }

    const transposed = this.transpose(item.note, item.octave);
    const channel = !Number.isNaN(item.channel)
      ? Number.parseInt(item.channel)
      : this.client.orca.valueOf(item.channel);

    if (!transposed) {
      return;
    }

    const c = down === true ? 0x90 + channel : 0x80 + channel;
    const n = transposed.id;
    const v = Math.floor((item.velocity / 16) * 127);

    if (!n || c === 127) {
      return;
    }

    this.outputDevice().send([c, n, v]);
  }

  press(item) {
    if (!item) {
      return;
    }
    this.trigger(item, true);
    item.isPlayed = true;
  }

  release(item, id) {
    if (!item) {
      return;
    }
    this.trigger(item, false);
    delete this.stack[id];
  }

  silence() {
    for (const item of this.stack) {
      this.release(item);
    }
  }

  push(channel, octave, note, velocity, length, isPlayed = false) {
    const item = { channel, octave, note, velocity, length, isPlayed };
    // Retrigger duplicates
    for (const id in this.stack) {
      const dup = this.stack[id];
      if (
        dup.channel === channel &&
        dup.octave === octave &&
        dup.note === note
      ) {
        this.release(item, id);
      }
    }
    this.stack.push(item);
  }

  allNotesOff() {
    if (!this.outputDevice()) {
      return;
    }
    console.log("MIDI", "All Notes Off");
    for (let chan = 0; chan < 16; chan++) {
      this.outputDevice().send([0xb0 + chan, 123, 0]);
    }
  }

  // Clock

  sendClockStart() {
    if (!this.outputDevice()) {
      return;
    }
    this.isClock = true;
    this.outputDevice().send([0xfa], 0);
    console.log("MIDI", "MIDI Start Sent");
  }

  sendClockStop() {
    if (!this.outputDevice()) {
      return;
    }
    this.isClock = false;
    this.outputDevice().send([0xfc], 0);
    console.log("MIDI", "MIDI Stop Sent");
  }

  sendClock() {
    if (!this.outputDevice()) {
      return;
    }
    if (this.isClock !== true) {
      return;
    }

    const bpm = this.client.clock.speed.value;
    const frameTime = 60000 / bpm / 4;
    const frameFrag = frameTime / 6;

    for (let id = 0; id < 6; id++) {
      if (this.ticks[id]) {
        clearTimeout(this.ticks[id]);
      }
      this.ticks[id] = setTimeout(() => {
        this.outputDevice().send([0xf8], 0);
      }, id * frameFrag);
    }
  }

  receive(msg) {
    switch (msg.data[0]) {
      // Clock
      case 0xf8:
        this.client.clock.tap();
        break;
      case 0xfa:
        console.log("MIDI", "Start Received");
        this.client.clock.play(false, true);
        break;
      case 0xfb:
        console.log("MIDI", "Continue Received");
        this.client.clock.play();
        break;
      case 0xfc:
        console.log("MIDI", "Stop Received");
        this.client.clock.stop();
        break;
    }
  }

  // Tools

  selectOutput(id) {
    if (id === -1) {
      this.outputIndex = -1;
      console.log("MIDI", "Select Output Device: None");
      return;
    }
    if (!this.outputs[id]) {
      console.warn("MIDI", `Unknown device with id ${id}`);
      return;
    }

    this.outputIndex = Number.parseInt(id);
    console.log("MIDI", `Select Output Device: ${this.outputDevice().name}`);
  }

  selectInput(id) {
    if (this.inputDevice()) {
      this.inputDevice().onmidimessage = null;
    }
    if (id === -1) {
      this.inputIndex = -1;
      console.log("MIDI", "Select Input Device: None");
      return;
    }
    if (!this.inputs[id]) {
      console.warn("MIDI", `Unknown device with id ${id}`);
      return;
    }

    this.inputIndex = Number.parseInt(id);
    this.inputDevice().onmidimessage = (msg) => {
      this.receive(msg);
    };
    console.log("MIDI", `Select Input Device: ${this.inputDevice().name}`);
  }

  outputDevice() {
    return this.outputs[this.outputIndex];
  }

  inputDevice() {
    return this.inputs[this.inputIndex];
  }

  selectNextOutput() {
    this.outputIndex =
      this.outputIndex < this.outputs.length ? this.outputIndex + 1 : 0;
    this.client.update();
  }

  selectNextInput() {
    const id =
      this.inputIndex < this.inputs.length - 1 ? this.inputIndex + 1 : -1;
    this.selectInput(id);
    this.client.update();
  }

  // Setup

  refresh() {
    if (!navigator.requestMIDIAccess) {
      return;
    }
    navigator.requestMIDIAccess().then(
      (midiAccess) => this.access(midiAccess),
      (err) => {
        console.warn("No Midi", err);
      },
    );
  }

  /**
   * @param {WebMidi.MIDIAccess} midiAccess
   */
  access(midiAccess) {
    const outputs = midiAccess?.outputs?.values();
    this.outputs = [];
    for (let i = outputs.next(); i && !i.done; i = outputs.next()) {
      this.outputs.push(i.value);
    }
    this.selectOutput(0);

    const inputs = midiAccess.inputs.values();
    this.inputs = [];
    for (let i = inputs.next(); i && !i.done; i = inputs.next()) {
      this.inputs.push(i.value);
    }
    this.selectInput(-1);
  }

  // UI

  transpose(n, o = 3) {
    if (!transposeTable[n]) {
      return null;
    }
    const octave = clamp(
      Math.floor(o) + Number.parseInt(transposeTable[n].charAt(1)),
      0,
      8,
    );
    const note = transposeTable[n].charAt(0);
    const value = [
      "C",
      "c",
      "D",
      "d",
      "E",
      "F",
      "f",
      "G",
      "g",
      "A",
      "a",
      "B",
    ].indexOf(note);
    const id = clamp(octave * 12 + value + 24, 0, 127);
    return { id, value, note, octave };
  }

  convert(id) {
    const note = ["C", "c", "D", "d", "E", "F", "f", "G", "g", "A", "a", "B"][
      id % 12
    ];
    const octave = Math.floor(id / 12) - 5;
    const name = `${note}${octave}`;
    const key = Object.values(transposeTable).indexOf(name);
    return Object.keys(transposeTable)[key];
  }

  toString() {
    return !navigator.requestMIDIAccess
      ? "No Midi Support"
      : this.outputDevice()
        ? `${this.outputDevice().name}`
        : "No Midi Device";
  }

  toInputString() {
    return !navigator.requestMIDIAccess
      ? "No Midi Support"
      : this.inputDevice()
        ? `${this.inputDevice().name}`
        : "No Input Device";
  }

  toOutputString() {
    return !navigator.requestMIDIAccess
      ? "No Midi Support"
      : this.outputDevice()
        ? `${this.outputDevice().name}`
        : "No Output Device";
  }

  length() {
    return this.stack.length;
  }
}
