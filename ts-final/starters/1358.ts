// 1358: Typed function memoization / scenario 05
// generic closures; Map cache; undefined results
// Memoize a unary function using SameValueZero input keys. Cache falsy and undefined results, preserve object identity keys, and do not cache thrown errors. Each constructed memoizer has an independent cache. Returned function preserves input/output types; no eviction or serialization.
// Scenario family repetition is intentional; see prompts/1358.txt and tests/1358.cjs.
export function solve<A,R>(fn:(input:A)=>R): (input:A)=>R {
  // Your implementation here.
  throw new Error('TODO exercise 1358');
}
