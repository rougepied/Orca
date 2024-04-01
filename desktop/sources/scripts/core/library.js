//@ts-check

import { OperatorA } from "./operators/operator-a.js";
import { OperatorB } from "./operators/operator-b.js";
import { OperatorC } from "./operators/operator-c.js";
import { OperatorD } from "./operators/operator-d.js";
import { OperatorE } from "./operators/operator-e.js";
import { OperatorF } from "./operators/operator-f.js";
import { OperatorG } from "./operators/operator-g.js";
import { OperatorH } from "./operators/operator-h.js";
import { OperatorI } from "./operators/operator-i.js";
import { OperatorJ } from "./operators/operator-j.js";
import { OperatorK } from "./operators/operator-k.js";
import { OperatorL } from "./operators/operator-l.js";
import { OperatorM } from "./operators/operator-m.js";
import { OperatorN } from "./operators/operator-n.js";
import { OperatorO } from "./operators/operator-o.js";
import { OperatorP } from "./operators/operator-p.js";
import { OperatorQ } from "./operators/operator-q.js";
import { OperatorR } from "./operators/operator-r.js";
import { OperatorS } from "./operators/operator-s.js";
import { OperatorT } from "./operators/operator-t.js";
import { OperatorU } from "./operators/operator-u.js";
import { OperatorV } from "./operators/operator-v.js";
import { OperatorW } from "./operators/operator-w.js";
import { OperatorX } from "./operators/operator-x.js";
import { OperatorY } from "./operators/operator-y.js";
import { OperatorZ } from "./operators/operator-z.js";
import { OperatorBang } from "./operators/operator-bang.js";
import { OperatorComment } from "./operators/operator-comment.js";
import { OperatorSelf } from "./operators/operator-self.js";
import { OperatorMidi } from "./operators/operator-midi.js";
import { OperatorCC } from "./operators/operator-cc.js";
import { OperatorPB } from "./operators/operator-pb.js";
import { OperatorMono } from "./operators/operator-mono.js";
import { OperatorOsc } from "./operators/operator-osc.js";
import { OperatorUdp } from "./operators/operator-udp.js";
import { OperatorNull } from "./operators/operator-null.js";

/* global client */

export const library = {
  a: OperatorA,
  b: OperatorB,
  c: OperatorC,
  d: OperatorD,
  e: OperatorE,
  f: OperatorF,
  g: OperatorG,
  h: OperatorH,
  i: OperatorI,
  j: OperatorJ,
  k: OperatorK,
  l: OperatorL,
  m: OperatorM,
  n: OperatorN,
  o: OperatorO,
  p: OperatorP,
  q: OperatorQ,
  r: OperatorR,
  s: OperatorS,
  t: OperatorT,
  u: OperatorU,
  v: OperatorV,
  w: OperatorW,
  x: OperatorX,
  y: OperatorY,
  z: OperatorZ,
  // Specials
  "*": OperatorBang,
  "#": OperatorComment,
  // IO
  $: OperatorSelf,
  ":": OperatorMidi,
  "!": OperatorCC,
  "?": OperatorPB,
  "%": OperatorMono,
  "=": OperatorOsc,
  ";": OperatorUdp,
};

// Add numbers

for (let i = 0; i <= 9; i++) {
  library[`${i}`] = OperatorNull;
}
