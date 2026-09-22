// 160: Square matrix main sum
// Input square matrix of finite numbers; [] returns0. Reject non-square rows with Error('Not square'). Sum main diagonal cells, no mutation.
// Tests: node js-rest/verify.cjs --id=160 [--starters]
// Study tests/160.cjs for examples.
// Why this works:
// The matrix is square when every row has exactly as many cells as there are
// rows, so the shape check compares each row length against input.length and
// throws Error('Not square') otherwise. An empty matrix has zero rows and no
// row to contradict it, so it passes the check and sums to 0.
// Policy main diagonal: the cells where the row index equals the column
// index, that is the top-left to bottom-right line.
// Only reads happen, so the matrix is not disturbed.
function solve(input) {
  const size = input.length;
  if (input.some(row => row.length !== size)) {
    throw new Error('Not square');
  }
  let sum = 0;
  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      if (row === column) {
        sum += input[row][column];
      }
    }
  }
  return sum;
}
module.exports=solve;
