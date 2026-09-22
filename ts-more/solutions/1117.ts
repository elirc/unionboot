// 1117: Minimum nonempty tuple / scenario 04
// nonempty tuples; generic comparison; safe indexing
// Return the smallest element of a statically nonempty tuple according to compare. Keep the first on ties and preserve its reference. Empty arrays must be rejected by the compiler; do not add an undefined return for impossible typed emptiness.
// Scenario family repetition is intentional; see prompts/1117.txt and tests/1117.cjs.
export function solve<T>(items: readonly [T,...T[]], compare:(a:T,b:T)=>number): T {
  let best=items[0];for(const item of items.slice(1)) if(compare(item,best)<0) best=item;return best;
}
