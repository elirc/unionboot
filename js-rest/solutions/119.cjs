// 119: Nearest point: squared distance
// Input {origin:[x,y],points:[[x,y],...]}. Return index of nearest point by squared distance; first wins ties, -1 if empty. Coordinates are finite. Do not sort/mutate input.
// Tests: node js-rest/verify.cjs --id=119 [--starters]
// Study tests/119.cjs for examples.
// Why this works:
// One linear scan keeps the best distance seen so far and the index that
// produced it, so the points array is never sorted or copied.
// The comparison is strictly less-than, which means a later point tied with
// the current best does not replace it: first wins ties.
// bestIndex starts at -1, so an empty points array falls straight through.
// Policy squared: distance is dx*dx + dy*dy. Skipping the square root is
// safe for ranking because squaring is monotonic on non-negative numbers,
// so the ordering, and therefore the winning index, is the euclidean one.
function solve(input) {
  const [originX, originY] = input.origin;
  let bestDistance = Infinity;
  let bestIndex = -1;
  for (let index = 0; index < input.points.length; index++) {
    const [x, y] = input.points[index];
    const dx = Math.abs(x - originX);
    const dy = Math.abs(y - originY);
    const distance = dx * dx + dy * dy;
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  }
  return bestIndex;
}
module.exports=solve;
