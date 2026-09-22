// 1940 Zero-one knapsack policies / scenario 2 — capacity=4; tie=heavier
// Prompt: ../prompts/1940.txt
'use strict';
const cfg={"capacity":4,"tie":"heavier"};
// Why this works:
// Classic 0/1 knapsack, but each dp cell keeps the whole winning selection
// {value, ids, weight} rather than a number, so the answer can be reported
// without a second traceback pass.
// dp[w] is the best selection that fits in capacity w. Items are considered
// one at a time, and the inner loop runs from cfg.capacity downwards so that
// dp[w - item.weight] is still the row from before this item - that is what
// keeps each item usable at most once.
// better() is the full ordering the prompt specifies: more value wins first,
// then policy tie=cfg.tie prefers the lighter or the heavier total weight,
// and finally the JSON of the id arrays breaks the remaining ties, which makes
// the result independent of anything but the item order.
// Policy capacity=cfg.capacity sets the table width. An invalid weight throws
// RangeError('Weight') before it can corrupt the table.
function knapsack(input) {
  const dp = Array.from({ length: cfg.capacity + 1 }, () => ({ value: 0, ids: [], weight: 0 }));
  const better = (a, b) => {
    if (a.value !== b.value) {
      return a.value > b.value ? a : b;
    }
    if (a.weight !== b.weight) {
      return (cfg.tie === 'lighter' ? a.weight < b.weight : a.weight > b.weight) ? a : b;
    }
    return JSON.stringify(a.ids) < JSON.stringify(b.ids) ? a : b;
  };

  for (const item of input) {
    if (!Number.isInteger(item.weight) || item.weight <= 0) {
      throw new RangeError('Weight');
    }
    for (let w = cfg.capacity; w >= item.weight; w--) {
      const without = dp[w - item.weight];
      dp[w] = better(dp[w], {
        value: without.value + item.value,
        ids: [...without.ids, item.id],
        weight: without.weight + item.weight
      });
    }
  }

  return dp[cfg.capacity];
}
module.exports=knapsack;
