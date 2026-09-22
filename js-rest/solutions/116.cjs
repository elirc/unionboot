// 116: Nearest point: euclidean distance
// Input {origin:[x,y],points:[[x,y],...]}. Return index of nearest point by euclidean distance; first wins ties, -1 if empty. Coordinates are finite. Do not sort/mutate input.
// Tests: node js-rest/verify.cjs --id=116 [--starters]
// Study tests/116.cjs for examples.
// Why this works:
// One linear scan keeps the best distance seen so far and the index that
// produced it, so the points array is never sorted or copied.
// The comparison is strictly less-than, which means a later point tied with
// the current best does not replace it: first wins ties.
// bestIndex starts at -1, so an empty points array falls straight through.
// Policy euclidean: distance is Math.hypot(dx, dy), the straight-line length.
function solve(input) {
  const [originX, originY] = input.origin;
  let bestDistance = Infinity;
  let bestIndex = -1;
  for (let index = 0; index < input.points.length; index++) {
    const [x, y] = input.points[index];
    const dx = Math.abs(x - originX);
    const dy = Math.abs(y - originY);
    const distance = Math.hypot(dx, dy);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  }
  return bestIndex;
}
module.exports=solve;
