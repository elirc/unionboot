// 1805 Huffman prefix codes / scenario 7 — tie=descending; output=table; zero=1
// Prompt: ../prompts/1805.txt
'use strict';
const cfg={"tie":"descending","output":"table","zero":"1"};
// Why this works:
// Huffman coding. counts is a Map from symbol to frequency, built in one pass
// over the input string. queue starts as one leaf per distinct symbol and is
// reduced, two nodes at a time, until a single tree remains.
// The merge order is the whole algorithm: the two least-weight nodes are removed
// and joined under a new node whose weight is their sum, and the node removed
// first becomes the left child. compare() is the priority order -- weight first,
// then the node's key. A node's key is its leaf symbols sorted and concatenated,
// so every node has a deterministic name and no two nodes can tie completely.
// cfg.tie says whether equal weights order ascending or descending by that key.
// The queue is kept as an array re-sorted before each removal. That is a priority
// order, not a binary heap: at these input sizes it is the clearer statement of
// "repeatedly take the two least-weight nodes", and it is the property the prompt
// requires.
// walk() assigns codes by descent: a left edge appends cfg.zero and a right edge
// the opposite bit. A single distinct symbol makes the root a leaf with no edges,
// so its code would be '' -- the prompt fixes that at one bit, cfg.zero.
// cfg.output projects the result: the [symbol, code] table sorted by symbol, the
// encoded length in bits or bytes, or both the table and the bit string.
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
  const oneBit = cfg.zero === '0' ? '1' : '0';
  function walk(node, bits) {
    if (node.symbol !== undefined) {
      table.set(node.symbol, bits || cfg.zero);
    } else {
      walk(node.left, bits + cfg.zero);
      walk(node.right, bits + oneBit);
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
