// 140: Multiset intersection
// Input {a:number[],b:number[]} of integers. Return sorted multiset intersection. Multiplicities use minimum. Do not treat duplicates as a simple set.
// Tests: node js-rest/verify.cjs --id=140 [--starters]
// Study tests/140.cjs for examples.
// Why this works:
// A multiset cares how many times a value appears, so each side is reduced to
// a Map from value to count. A Set would throw that information away.
// The candidate values are the union of both key sets, sorted numerically, so
// the output is sorted ascending without sorting the input arrays.
// Policy intersection: a value survives min(countA, countB) times.
// Both input arrays are only read.
function solve(input) {
  const tally = numbers => {
    const counts = new Map();
    for (const value of numbers) {
      counts.set(value, (counts.get(value) || 0) + 1);
    }
    return counts;
  };
  const countsA = tally(input.a);
  const countsB = tally(input.b);
  const allValues = [...new Set([...countsA.keys(), ...countsB.keys()])];
  allValues.sort((x, y) => x - y);
  const result = [];
  for (const value of allValues) {
    const inA = countsA.get(value) || 0;
    const inB = countsB.get(value) || 0;
    const repeats = Math.min(inA, inB);
    for (let i = 0; i < repeats; i++) {
      result.push(value);
    }
  }
  return result;
}
module.exports=solve;
