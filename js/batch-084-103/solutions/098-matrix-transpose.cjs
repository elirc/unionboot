// 98: Transpose a rectangular matrix
// Return a fresh transpose of a dense rectangular array of rows; [] and rows with zero columns return []. Throw RangeError for unequal row lengths. Do not mutate input rows. Cell objects retain identity.
// Hint: The result has one row per original column.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=98
'use strict';
// Why this works:
// The transpose has one row per original column, so the outer Array.from
// builds `width` rows. Row `column` of the result is collected by reading cell
// `column` out of every original row in order, which is exactly
// matrix.map(row => row[column]).
// Both the outer array and each inner array are newly allocated, so no input
// row is written to. The cells themselves are copied by reference, which is
// what lets the test assert that an object cell comes back identical under ===.
// An empty matrix has no first row to measure, so it returns [] before `width`
// is read.
// A matrix whose rows are all empty has width 0, and Array.from({length:0}) is
// [] — that is the solve([[],[]]) case in the test.
// Rows of unequal length have no transpose, so a ragged matrix is rejected
// with RangeError after the width is taken from the first row.
function transpose(matrix) {
  if (matrix.length === 0) {
    return [];
  }
  const width = matrix[0].length;
  if (matrix.some((row) => row.length !== width)) {
    throw new RangeError('Ragged matrix');
  }
  return Array.from({ length: width }, (_, column) => matrix.map((row) => row[column]));
}
module.exports = transpose;
