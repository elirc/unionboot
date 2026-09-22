// 844: Stable unique by key / scenario 01
// generic keys; Map/Set equality; readonly
// Keep the first record for each extracted key, preserving order and references. Use SameValueZero key equality (NaN equals NaN, object keys by identity). Invoke keyOf once per input.
// Scenario family repetition is intentional; see prompts/844.txt and tests/844.cjs.
export function solve<T, K>(items: readonly T[], keyOf: (item: T) => K): T[] {
  const seen = new Set<K>(); const out: T[] = []; for(const item of items) { const key=keyOf(item); if(!seen.has(key)) { seen.add(key); out.push(item); } } return out;
}
