// 129: Best candidate with last ties
// Input array of {id:string,score:number}. Return id or null of maximum-score candidates, using last tie policy.  Empty returns null.
// Tests: node js-rest/verify.cjs --id=129 [--starters]
// Study tests/129.cjs for examples.
// Why this works:
// One pass keeps the best score seen so far plus the ids that reached it.
// A strictly greater score restarts the list; an equal score appends, so the
// list ends up holding every top scorer in input order.
// Policy last: return the latest of the tied ids, the final element.
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
  return bestIds[bestIds.length - 1];
}
module.exports=solve;
