// 101: Levenshtein edit distance
// For ASCII strings, return the minimum number of single-character insertions, deletions and substitutions to change a into b. Each costs 1. Use a rolling DP row rather than storing the full matrix.
// Hint: Save the old diagonal before overwriting each DP cell.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=101
'use strict';
// Why this works:
// The classic edit-distance table has one cell per (prefix of a, prefix of b)
// pair, and cell (i, j) depends only on three neighbours: the cell above, the
// cell to the left and the cell diagonally above-left. So a single row of the
// table is enough, provided the above-left value is saved before it gets
// overwritten. That saved value is `diagonal`, and keeping it is what the
// header means by a rolling DP row rather than the full matrix.
// Row 0 is seeded with 0,1,2,...: turning an empty `a` into the first j
// characters of `b` costs j insertions. At the start of row i, row[0] becomes
// i for the mirror reason — deleting i characters of `a`.
// Inside the row, before row[j] is assigned it still holds the cell above
// (a deletion, cost + 1); row[j - 1] has already been assigned this row, so it
// is the cell to the left (an insertion, cost + 1); and `diagonal` is the
// above-left cell (a substitution, free when the two characters match).
// After the last row, row[b.length] is the distance.
function editDistance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const above = row[j];
      const deletion = above + 1;
      const insertion = row[j - 1] + 1;
      const substitution = diagonal + (a[i - 1] === b[j - 1] ? 0 : 1);
      row[j] = Math.min(deletion, insertion, substitution);
      diagonal = above;
    }
  }
  return row[b.length];
}
module.exports = editDistance;
