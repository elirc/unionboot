// 101: Levenshtein edit distance
// For ASCII strings, return the minimum number of single-character insertions, deletions and substitutions to change a into b. Each costs 1. Use a rolling DP row rather than storing the full matrix.
// Hint: Save the old diagonal before overwriting each DP cell.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=101
'use strict';
function editDistance(a,b) {
  const row=Array.from({length:b.length+1},(_,i)=>i);
  for(let i=1;i<=a.length;i++){let diagonal=row[0];row[0]=i;
    for(let j=1;j<=b.length;j++){const old=row[j];row[j]=Math.min(row[j]+1,row[j-1]+1,diagonal+(a[i-1]===b[j-1]?0:1));diagonal=old;}}
  return row[b.length];
}
module.exports = editDistance;
