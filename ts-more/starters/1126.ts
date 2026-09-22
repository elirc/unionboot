// 1126: Minimum nonempty tuple / scenario 13
// nonempty tuples; generic comparison; safe indexing
// Return the smallest element of a statically nonempty tuple according to compare. Keep the first on ties and preserve its reference. Empty arrays must be rejected by the compiler; do not add an undefined return for impossible typed emptiness.
// Scenario family repetition is intentional; see prompts/1126.txt and tests/1126.cjs.
export function solve<T>(items: readonly [T,...T[]], compare:(a:T,b:T)=>number): T {
  // Your implementation here.
  throw new Error('TODO exercise 1126');
}
