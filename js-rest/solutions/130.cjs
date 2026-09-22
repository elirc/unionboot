// 130: Best candidate with all ties
// Input array of {id:string,score:number}. Return array of ids of maximum-score candidates, using all tie policy.  Empty returns [].
// Tests: node js-rest/verify.cjs --id=130 [--starters]
// Study tests/130.cjs for examples.
// Why this works:
// One pass keeps the best score seen so far plus the ids that reached it.
// A strictly greater score restarts the list; an equal score appends, so the
// list ends up holding every top scorer in input order.
// Policy all: return the whole list, so this is the only variant whose
// return type is an array, and whose empty case is [] rather than null.
function solve(input) {
  if (input.length === 0) {
    return [];
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
  return bestIds;
}
module.exports=solve;
