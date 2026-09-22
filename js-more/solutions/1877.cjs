// 1877 LCS edit scripts / scenario 9 — fold=false; output=length
// Prompt: ../prompts/1877.txt
'use strict';
const cfg={"fold":false,"output":"length"};
// Why this works:
// dp[i][j] is the length of the longest common subsequence of a.slice(i) and
// b.slice(j). Filling it from the back means every cell only needs cells below
// and to the right, so one double loop is enough: O(len(a) * len(b)).
// The second phase walks forward from (0,0) and turns that table into an edit
// script. Equal characters are kept; otherwise the walk takes whichever of
// delete or insert keeps the longer subsequence, and when both are equally
// long the tie policy decides.
// Policy tie=cfg.tie picks delete or insert on an equal-length alternative.
// Policy fold=cfg.fold compares case-insensitively, but a kept character is
// still taken from b, so the target's case survives.
// Policy output=cfg.output returns the operations, the kept characters joined
// into a string, or just how many were kept.
function lcsDiff(input) {
  const a = [...input.a];
  const b = [...input.b];
  const equal = (x, y) => (cfg.fold ? x.toLowerCase() === y.toLowerCase() : x === y);

  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      dp[i][j] = equal(a[i], b[j]) ? 1 + dp[i + 1][j + 1] : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const ops = [];
  const kept = [];
  let i = 0;
  let j = 0;
  while (i < a.length || j < b.length) {
    const canDelete = i < a.length;
    const canInsert = j < b.length;
    if (canDelete && canInsert && equal(a[i], b[j])) {
      ops.push(['keep', b[j]]);
      kept.push(b[j]);
      i++;
      j++;
    } else if (canDelete && (!canInsert || dp[i + 1][j] > dp[i][j + 1] || (dp[i + 1][j] === dp[i][j + 1] && cfg.tie === 'delete'))) {
      ops.push(['delete', a[i]]);
      i++;
    } else {
      ops.push(['insert', b[j]]);
      j++;
    }
  }

  if (cfg.output === 'length') return kept.length;
  if (cfg.output === 'common') return kept.join('');
  return ops;
}
module.exports=lcsDiff;
