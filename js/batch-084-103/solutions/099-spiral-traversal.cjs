// 99: Walk a matrix clockwise
// Return rectangular matrix values in clockwise spiral order starting at top-left. Empty rows/matrix return []. Inputs are rectangular; do not mutate them. Handle single rows and columns without duplicates.
// Hint: Shrink top, bottom, left and right boundaries; guard the last two edges.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=99
'use strict';
// Why this works:
// Four boundaries fence off the rectangle that has not been emitted yet: rows
// `top` through `bottom` and columns `left` through `right`. Each turn round
// the loop walks the top row left to right, the right column top to bottom,
// the bottom row right to left and the left column bottom to top, shrinking
// the matching boundary immediately after each walk.
// The last two walks are guarded, and that is the whole difficulty of the
// exercise. Once the top row has been consumed and `top` has moved past
// `bottom`, an unguarded bottom walk would emit the same single row a second
// time. `if (top <= bottom)` and `if (left <= right)` are what make a
// single-row matrix come out as [1,2,3] and a single-column matrix as [1,2,3]
// rather than with duplicates.
// An empty matrix gives bottom = -1, and a matrix of empty rows gives
// right = -1, so in both cases the loop never runs and the result is [].
// The optional chaining on matrix[0] is what allows `right` to be computed at
// all when there are no rows.
// Cells are only read, never written, so the matrix is unchanged.
function spiral(matrix) {
  const out = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = (matrix[0]?.length ?? 0) - 1;
  while (top <= bottom && left <= right) {
    for (let column = left; column <= right; column++) {
      out.push(matrix[top][column]);
    }
    top++;
    for (let row = top; row <= bottom; row++) {
      out.push(matrix[row][right]);
    }
    right--;
    if (top <= bottom) {
      for (let column = right; column >= left; column--) {
        out.push(matrix[bottom][column]);
      }
      bottom--;
    }
    if (left <= right) {
      for (let row = bottom; row >= top; row--) {
        out.push(matrix[row][left]);
      }
      left++;
    }
  }
  return out;
}
module.exports = spiral;
