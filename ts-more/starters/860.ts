// 860: Group into typed Map / scenario 02
// generic Map keys; bucket types
// Group elements by extractor key. Preserve first-key insertion order, item order, and element references. Support object, symbol and prototype-looking string keys without collisions.
// Scenario family repetition is intentional; see prompts/860.txt and tests/860.cjs.
export function solve<T, K>(items: readonly T[], keyOf: (item: T) => K): Map<K, T[]> {
  // Your implementation here.
  throw new Error('TODO exercise 860');
}
