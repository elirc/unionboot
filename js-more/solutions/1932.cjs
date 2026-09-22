// 1932 Consistent-hash ring / scenario 4 — replicas=2; slots=127
// Prompt: ../prompts/1932.txt
'use strict';
const cfg={"replicas":2,"slots":127};
// Why this works:
// A consistent-hash ring places every node at one or more positions around a
// circle of cfg.slots points, and a key belongs to the first position at or
// after the key's own hash, wrapping past the end back to the start.
// The ring is built once and sorted by position, with node label and replica
// number as tie-breakers so that equal positions have a defined order.
// Lookup is a binary search for the first position >= the key's hash, which
// the prompt requires ("Use binary-search successor") and only a source review
// can check. lo === ring.length means the key hashed past the last position,
// and lo % ring.length wraps it to entry 0.
// Policy replicas=cfg.replicas is how many virtual positions each node gets,
// hashed from node+'#'+replica; policy slots=cfg.slots is the ring modulus and
// the modulus of the rolling hash. With no nodes every key answers null.
function hashRing(input) {
  const hash = text => {
    let h = 0;
    for (const ch of text) {
      h = (h * 31 + ch.charCodeAt(0)) % cfg.slots;
    }
    return h;
  };

  const ring = [];
  for (const node of input.nodes) {
    for (let replica = 0; replica < cfg.replicas; replica++) {
      ring.push({ node, position: hash(node + '#' + replica), replica });
    }
  }
  ring.sort((a, b) => a.position - b.position || (a.node < b.node ? -1 : a.node > b.node ? 1 : a.replica - b.replica));

  return input.keys.map(key => {
    if (!ring.length) return null;
    const point = hash(key);
    let lo = 0;
    let hi = ring.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (ring[mid].position < point) lo = mid + 1;
      else hi = mid;
    }
    return ring[lo % ring.length].node;
  });
}
module.exports=hashRing;
