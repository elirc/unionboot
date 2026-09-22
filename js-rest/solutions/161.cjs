// 161: Square matrix anti sum
// Input square matrix of finite numbers; [] returns0. Reject non-square rows with Error('Not square'). Sum anti-diagonal cells, no mutation.
// Tests: node js-rest/verify.cjs --id=161 [--starters]
// Study tests/161.cjs for examples.
// Why this works:
// The matrix is square when every row has exactly as many cells as there are
// rows, so the shape check compares each row length against input.length and
// throws Error('Not square') otherwise. An empty matrix has zero rows and no
// row to contradict it, so it passes the check and sums to 0.
// Policy anti-diagonal: the cells where row + column === size - 1, that is
// the top-right to bottom-left line.
// Only reads happen, so the matrix is not disturbed.
function solve(input) {
  const size = input.length;
  if (input.some(row => row.length !== size)) {
    throw new Error('Not square');
  }
  let sum = 0;
  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      if (row + column === size - 1) {
        sum += input[row][column];
      }
    }
  }
  return sum;
}
module.exports=solve;
