// 861: Group into typed Map / scenario 03
// generic Map keys; bucket types
// Group elements by extractor key. Preserve first-key insertion order, item order, and element references. Support object, symbol and prototype-looking string keys without collisions.
// Scenario family repetition is intentional; see prompts/861.txt and tests/861.cjs.
export function solve<T, K>(items: readonly T[], keyOf: (item: T) => K): Map<K, T[]> {
  const out=new Map<K,T[]>(); for(const item of items) { const key=keyOf(item); const bucket=out.get(key); if(bucket) bucket.push(item); else out.set(key,[item]); } return out;
}
