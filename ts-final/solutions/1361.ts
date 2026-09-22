// 1361: Typed function memoization / scenario 08
// generic closures; Map cache; undefined results
// Memoize a unary function using SameValueZero input keys. Cache falsy and undefined results, preserve object identity keys, and do not cache thrown errors. Each constructed memoizer has an independent cache. Returned function preserves input/output types; no eviction or serialization.
// Scenario family repetition is intentional; see prompts/1361.txt and tests/1361.cjs.
export function solve<A,R>(fn:(input:A)=>R): (input:A)=>R {
  const cache=new Map<A,R>();return input=>{if(cache.has(input))return cache.get(input)!;const result=fn(input);cache.set(input,result);return result;};
}
