// 1808 Huffman prefix codes / scenario 10 — output=length; unit=bytes
// Prompt: ../prompts/1808.txt
'use strict';
const cfg={"output":"length","unit":"bytes"};
// Why this works:
// Huffman coding. counts is a Map from symbol to frequency, built in one pass
// over the input string. queue starts as one leaf per distinct symbol and is
// reduced, two nodes at a time, until a single tree remains.
// The merge order is the whole algorithm: the two least-weight nodes are removed
// and joined under a new node whose weight is their sum, and the node removed
// first becomes the left child. compare() is the priority order -- weight first,
// then the node's key. A node's key is its leaf symbols sorted and concatenated,
// so every node has a deterministic name and no two nodes can tie completely.
// The queue is kept as an array re-sorted before each removal. That is a priority
// order, not a binary heap: at these input sizes it is the clearer statement of
// "repeatedly take the two least-weight nodes", and it is the property the prompt
// requires.
// This scenario reports only the encoded length, so cfg carries no zero knob and
// the bit labels are fixed: left edges are '0', right edges '1', and a single
// distinct symbol gets the one-bit code '0'. The prompt notes that the length is
// invariant under the tie policy, which is why cfg has no tie knob either --
// compare() still consults cfg.tie, and with it undefined the key tie-break runs
// descending, which changes the shape of the tree but not the total bit count.
// cfg.unit then reports that total in bits, or in whole bytes via
// Math.ceil(bits.length / 8).
function huffman(input) {
  const counts = new Map();
  for (const ch of input) counts.set(ch, (counts.get(ch) || 0) + 1);
  const queue = [...counts].map(([symbol, weight]) => ({symbol, weight, key: symbol}));
  const compare = (left, right) =>
    left.weight - right.weight ||
    (left.key < right.key ? (cfg.tie === 'ascending' ? -1 : 1) :
     left.key > right.key ? (cfg.tie === 'ascending' ? 1 : -1) :
     0);
  while (queue.length > 1) {
    queue.sort(compare);
    const left = queue.shift();
    const right = queue.shift();
    queue.push({
      left,
      right,
      weight: left.weight + right.weight,
      key: [...left.key + right.key].sort().join(''),
    });
  }
  const table = new Map();
  function walk(node, bits) {
    if (node.symbol !== undefined) {
      table.set(node.symbol, bits || '0');
    } else {
      walk(node.left, bits + '0');
      walk(node.right, bits + '1');
    }
  }
  if (queue.length) walk(queue[0], '');
  const codes = [...table].sort((left, right) => (left[0] < right[0] ? -1 : 1));
  const bits = [...input].map(ch => table.get(ch)).join('');
  if (cfg.output === 'table') return codes;
  if (cfg.output === 'length') return cfg.unit === 'bytes' ? Math.ceil(bits.length / 8) : bits.length;
  return {codes, bits};
}
module.exports=huffman;
