// 131: Best candidate with error ties
// Input array of {id:string,score:number}. Return id or null of maximum-score candidates, using error tie policy. Throw Error("Tied score") if top score is shared. Empty returns null.
// Tests: node js-rest/verify.cjs --id=131 [--starters]
// Study tests/131.cjs for examples.
// Why this works:
// One pass keeps the best score seen so far plus the ids that reached it.
// A strictly greater score restarts the list; an equal score appends, so the
// list ends up holding every top scorer in input order.
// Policy error: a shared top score is not allowed, so more than one id in the
// list raises Error("Tied score"). The check happens after the scan, because
// a tie is only known once every candidate has been seen.
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
  if (bestIds.length > 1) {
    throw new Error("Tied score");
  }
  return bestIds[0];
}
module.exports=solve;
