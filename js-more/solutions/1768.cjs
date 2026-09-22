// 1768 Union-find components / scenario 10 — size=7; root=maximum
// Prompt: ../prompts/1768.txt
'use strict';
const cfg={"size":7,"root":"maximum"};
// Why this works:
// Disjoint-set union over the fixed node range 0..cfg.size-1. parent[i] is the
// node one step closer to i's representative; a node that is its own parent is
// the representative.
// find() is the two-pass version with full path compression, which the prompt
// requires: the first loop walks to the root, the second re-walks the same chain
// and repoints every node on it straight at the root. After a find, none of the
// visited nodes is more than one hop from its representative.
// cfg.root fixes which of two merging representatives survives: 'minimum' keeps
// the smaller numbered node and reparents the larger, 'maximum' does the
// reverse. That is the only place the policy appears.
// Both node fields are range-checked before the operation is dispatched, so an
// out-of-range node throws RangeError('Unknown node') even when the operation
// type is also unknown.
// The final roots array calls find() on every node, which both reports the
// representatives and finishes compressing the forest; components is the number
// of distinct representatives.
function unionFind(input) {
  const n = cfg.size;
  const parent = Array.from({length: n}, (_, i) => i);
  const answers = [];
  function find(x) {
    let root = x;
    while (parent[root] !== root) root = parent[root];
    while (parent[x] !== x) {
      const next = parent[x];
      parent[x] = root;
      x = next;
    }
    return root;
  }
  const inRange = value => Number.isInteger(value) && value >= 0 && value < n;
  for (const op of input) {
    if (!inRange(op.a) || !inRange(op.b)) throw new RangeError('Unknown node');
    const rootA = find(op.a);
    const rootB = find(op.b);
    if (op.type === 'union') {
      if (rootA !== rootB) {
        const survivor = cfg.root === 'minimum' ? Math.min(rootA, rootB) : Math.max(rootA, rootB);
        const absorbed = cfg.root === 'minimum' ? Math.max(rootA, rootB) : Math.min(rootA, rootB);
        parent[absorbed] = survivor;
      }
    } else if (op.type === 'same') {
      answers.push(rootA === rootB);
    } else {
      throw new Error('Unknown operation');
    }
  }
  const roots = parent.map((_, i) => find(i));
  return {answers, roots, components: new Set(roots).size};
}
module.exports=unionFind;
