// 1921 Segment-tree extrema / scenario 3 — extreme=max; tie=first; output=pair
// Prompt: ../prompts/1921.txt
'use strict';
const cfg={"extreme":"max","tie":"first","output":"pair"};
// Why this works:
// An iterative segment tree over a power-of-two number of leaves. Leaf i lives
// at tree[size + i] and every internal node is the merge of its two children,
// so a point update repairs one path to the root and a range query stitches
// together O(log n) precomputed nodes. The prompt requires those O(log n)
// bounds and only a source review can check them.
// Each node carries {value, index}, not just a value, so the winning position
// survives the merge and no second scan is needed.
// merge is where both policies live: policy extreme=cfg.extreme picks the
// smaller or the larger value, and policy tie=cfg.tie picks the lower or the
// higher index when two values are equal. Padding leaves stay null and merge
// treats null as "nothing", so they never win.
// Policy output=cfg.output reports the whole pair, just the index, or just the
// value; an empty range is null under every policy.
// values is a copy of input.values, so the caller's array is never written to.
function segmentTree(input) {
  const values = [...input.values];
  let size = 1;
  while (size < values.length) {
    size *= 2;
  }
  const tree = Array(size * 2).fill(null);

  const merge = (a, b) => {
    if (a === null) return b;
    if (b === null) return a;
    if (a.value !== b.value) {
      return (cfg.extreme === 'min' ? a.value < b.value : a.value > b.value) ? a : b;
    }
    return (cfg.tie === 'first' ? a.index < b.index : a.index > b.index) ? a : b;
  };

  values.forEach((value, index) => { tree[size + index] = { value, index }; });
  for (let i = size - 1; i > 0; i--) {
    tree[i] = merge(tree[2 * i], tree[2 * i + 1]);
  }

  const answers = [];
  for (const op of input.ops) {
    if (op.type === 'set') {
      if (!Number.isInteger(op.index) || op.index < 0 || op.index >= values.length) {
        throw new RangeError('Index');
      }
      values[op.index] = op.value;
      let at = size + op.index;
      tree[at] = { value: op.value, index: op.index };
      while (at > 1) {
        at >>= 1;
        tree[at] = merge(tree[at * 2], tree[at * 2 + 1]);
      }
    } else if (op.type === 'query') {
      if (!Number.isInteger(op.start) || !Number.isInteger(op.end) || op.start < 0 || op.end < op.start || op.end > values.length) {
        throw new RangeError('Range');
      }
      let left = size + op.start;
      let right = size + op.end;
      let result = null;
      while (left < right) {
        if (left % 2) result = merge(result, tree[left++]);
        if (right % 2) result = merge(result, tree[--right]);
        left >>= 1;
        right >>= 1;
      }
      answers.push(result === null ? null : cfg.output === 'index' ? result.index : cfg.output === 'value' ? result.value : result);
    } else {
      throw new Error('Unknown operation');
    }
  }

  return answers;
}
module.exports=segmentTree;
