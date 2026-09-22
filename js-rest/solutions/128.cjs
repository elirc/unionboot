// 128: Best candidate with first ties
// Input array of {id:string,score:number}. Return id or null of maximum-score candidates, using first tie policy.  Empty returns null.
// Tests: node js-rest/verify.cjs --id=128 [--starters]
// Study tests/128.cjs for examples.
// Why this works:
// One pass keeps the best score seen so far plus the ids that reached it.
// A strictly greater score restarts the list; an equal score appends, so the
// list ends up holding every top scorer in input order.
// Policy first: return the earliest of the tied ids, bestIds[0].
// The empty input is handled before the loop so the -Infinity seed can never
// be mistaken for a real score.
function solve(input) {
  if (input.length === 0) {
    return null;
  }
  let bestScore = -Infinity;
  let bestIds = [];
  for (const candidate of input) {
    if (candidate.score > bestScore) {
      bestScore = candidate.score;
      bestIds = [candidate.id];
    } else if (candidate.score === bestScore) {
      bestIds.push(candidate.id);
    }
  }
  return bestIds[0];
}
module.exports=solve;
