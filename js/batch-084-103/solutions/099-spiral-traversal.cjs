// 99: Walk a matrix clockwise
// Return rectangular matrix values in clockwise spiral order starting at top-left. Empty rows/matrix return []. Inputs are rectangular; do not mutate them. Handle single rows and columns without duplicates.
// Hint: Shrink top, bottom, left and right boundaries; guard the last two edges.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=99
'use strict';
function spiral(matrix) {
  const out=[];let top=0,bottom=matrix.length-1,left=0,right=(matrix[0]?.length??0)-1;
  while(top<=bottom&&left<=right){
    for(let c=left;c<=right;c++)out.push(matrix[top][c]);top++;
    for(let r=top;r<=bottom;r++)out.push(matrix[r][right]);right--;
    if(top<=bottom){for(let c=right;c>=left;c--)out.push(matrix[bottom][c]);bottom--;}
    if(left<=right){for(let r=bottom;r>=top;r--)out.push(matrix[r][left]);left++;}
  }return out;
}
module.exports = spiral;
