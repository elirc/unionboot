// 86: Partition with callback indices
// Return [matches, others], preserving input order. Call predicate(value,index) exactly once per item. Input is a dense array; do not mutate it.
// Hint: One loop and two result arrays avoid evaluating the predicate twice.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=86
'use strict';
// Why this works:
// One pass over the input, two output arrays. Each value is appended to
// `matches` or to `others` depending on the predicate, and appending keeps the
// relative order of the values inside each array equal to the input order.
// That is what "stable" means for a partition.
// The predicate is called once per item and its single result decides the
// destination. Writing this as two filter calls would evaluate the predicate
// twice per item; the test records every call in `seen` and then asserts that
// seen equals [['a',0],['b',1],['c',2]], so both the number of calls and the
// (value, index) argument pair are checked.
// forEach supplies the index, and nothing is ever written back into `values`.
function partition(values, predicate) {
  const matches = [];
  const others = [];
  values.forEach((value, index) => {
    if (predicate(value, index)) {
      matches.push(value);
    } else {
      others.push(value);
    }
  });
  return [matches, others];
}
module.exports = partition;
