// 98: Transpose a rectangular matrix
// Return a fresh transpose of a dense rectangular array of rows; [] and rows with zero columns return []. Throw RangeError for unequal row lengths. Do not mutate input rows. Cell objects retain identity.
// Hint: The result has one row per original column.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=98
'use strict';
function transpose(matrix) {
  if(!matrix.length)return [];
  const width=matrix[0].length;if(matrix.some(row=>row.length!==width))throw new RangeError('Ragged matrix');
  return Array.from({length:width},(_,c)=>matrix.map(row=>row[c]));
}
module.exports = transpose;
