// 847: Stable unique by key / scenario 04
// generic keys; Map/Set equality; readonly
// Keep the first record for each extracted key, preserving order and references. Use SameValueZero key equality (NaN equals NaN, object keys by identity). Invoke keyOf once per input.
// Scenario family repetition is intentional; see prompts/847.txt and tests/847.cjs.
export function solve<T, K>(items: readonly T[], keyOf: (item: T) => K): T[] {
  // Your implementation here.
  throw new Error('TODO exercise 847');
}
