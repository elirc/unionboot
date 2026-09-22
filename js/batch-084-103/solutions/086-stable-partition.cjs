// 86: Partition with callback indices
// Return [matches, others], preserving input order. Call predicate(value,index) exactly once per item. Input is a dense array; do not mutate it.
// Hint: One loop and two result arrays avoid evaluating the predicate twice.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=86
'use strict';
function partition(values,predicate) {
  const yes=[], no=[];
  values.forEach((value,index)=>(predicate(value,index)?yes:no).push(value));
  return [yes,no];
}
module.exports = partition;
