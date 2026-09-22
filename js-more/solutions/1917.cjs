// 1917 Fenwick point updates / scenario 9 — update=set; inclusive=false; output=sum; initialOffset=1
// Prompt: ../prompts/1917.txt
'use strict';
const cfg={"update":"set","inclusive":false,"output":"sum","initialOffset":1};
// Why this works:
// A Fenwick (binary indexed) tree stores partial sums in a 1-based array so
// that both a point update and a prefix sum touch only O(log n) slots, which
// the prompt requires and only a source review can check. i & -i isolates the
// lowest set bit of i: adding it walks up to the slots that cover position i,
// subtracting it walks down the prefix.
// nums is a local copy of input.values, so the caller's array is never
// written to, and it is also the snapshot returned at the end.
// A range is turned into two prefix sums, sum(end) - sum(start).
// Policy update=cfg.update decides whether an update replaces the cell or adds
// to it; either way the tree is fed the delta next - nums[index].
// Policy inclusive=cfg.inclusive shifts a range end by one before validation.
// Policy output=cfg.output returns the sum, or the mean with null for an empty
// range.
// Policy initialOffset=1 adds one to every starting value before the tree is
// built; later updates carry no offset.
function fenwick(input) {
  const nums = input.values.map(x => x + cfg.initialOffset);
  const tree = Array(nums.length + 1).fill(0);
  const answers = [];
  const add = (at, value) => {
    for (let i = at + 1; i < tree.length; i += i & -i) {
      tree[i] += value;
    }
  };
  const sum = end => {
    let total = 0;
    for (let i = end; i > 0; i -= i & -i) {
      total += tree[i];
    }
    return total;
  };
  nums.forEach((x, i) => add(i, x));

  for (const op of input.ops) {
    if (op.type === 'update') {
      if (!Number.isInteger(op.index) || op.index < 0 || op.index >= nums.length) {
        throw new RangeError('Index');
      }
      const next = cfg.update === 'set' ? op.value : nums[op.index] + op.value;
      add(op.index, next - nums[op.index]);
      nums[op.index] = next;
    } else if (op.type === 'range') {
      const end = op.end + (cfg.inclusive ? 1 : 0);
      if (!Number.isInteger(op.start) || !Number.isInteger(end) || op.start < 0 || end < op.start || end > nums.length) {
        throw new RangeError('Range');
      }
      const value = sum(end) - sum(op.start);
      answers.push(cfg.output === 'average' ? (end === op.start ? null : value / (end - op.start)) : value);
    } else {
      throw new Error('Unknown operation');
    }
  }

  return { answers, values: nums };
}
module.exports=fenwick;
