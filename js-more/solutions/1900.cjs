// 1900 Bloom membership bitsets / scenario 2 — bits=7; hashes=3
// Prompt: ../prompts/1900.txt
'use strict';
const cfg={"bits":7,"hashes":3};
// Why this works:
// A Bloom filter is one bit array plus a family of hash functions. Adding a
// value sets every bit it hashes to; asking about a value answers true only if
// every one of those bits is already set. Bits are never cleared, so the filter
// can say true for a value that was never added - a false positive - but never
// false for one that was.
// positions() runs the two rolling hashes the prompt specifies, a over *31 and
// b over *17 with a +1, then derives cfg.hashes probes as (a + i*step) % bits.
// The step is b||1 so that a b of zero does not collapse every probe onto the
// same bit.
// Policy bits=cfg.bits sets the bit array length and the hash modulus; policy
// hashes=cfg.hashes sets how many probes each value gets. The bit array is a
// plain array indexed by number, so a value such as '__proto__' is just another
// string to hash.
function bloom(input) {
  const bits = Array(cfg.bits).fill(0);
  const answers = [];

  function positions(text) {
    let a = 0;
    let b = 0;
    for (const ch of text) {
      a = (a * 31 + ch.charCodeAt(0)) % cfg.bits;
      b = (b * 17 + ch.charCodeAt(0) + 1) % cfg.bits;
    }
    return Array.from({ length: cfg.hashes }, (_, i) => (a + i * (b || 1)) % cfg.bits);
  }

  for (const op of input) {
    const indexes = positions(op.value);
    if (op.type === 'add') {
      for (const index of indexes) {
        bits[index] = 1;
      }
    } else if (op.type === 'has') {
      answers.push(indexes.every(index => bits[index] === 1));
    } else {
      throw new Error('Unknown operation');
    }
  }

  return { answers, bits: bits.join('') };
}
module.exports=bloom;
