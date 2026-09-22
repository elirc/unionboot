// 162: Square matrix above sum
// Input square matrix of finite numbers; [] returns0. Reject non-square rows with Error('Not square'). Sum strictly above main diagonal cells, no mutation.
// Tests: node js-rest/verify.cjs --id=162 [--starters]
// Study tests/162.cjs for examples.
// Why this works:
// The matrix is square when every row has exactly as many cells as there are
// rows, so the shape check compares each row length against input.length and
// throws Error('Not square') otherwise. An empty matrix has zero rows and no
// row to contradict it, so it passes the check and sums to 0.
// Policy strictly above: column > row, so the diagonal itself is excluded.
// A 1x1 matrix therefore sums to 0, not to its single cell.
// Only reads happen, so the matrix is not disturbed.
function solve(input) {
  const size = input.length;
  if (input.some(row => row.length !== size)) {
    throw new Error('Not square');
  }
  let sum = 0;
  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      if (column > row) {
        sum += input[row][column];
      }
    }
  }
  return sum;
}
module.exports=solve;
