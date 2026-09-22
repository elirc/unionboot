// 852: Stable unique by key / scenario 09
// generic keys; Map/Set equality; readonly
// Keep the first record for each extracted key, preserving order and references. Use SameValueZero key equality (NaN equals NaN, object keys by identity). Invoke keyOf once per input.
// Scenario family repetition is intentional; see prompts/852.txt and tests/852.cjs.
export function solve<T, K>(items: readonly T[], keyOf: (item: T) => K): T[] {
  // Your implementation here.
  throw new Error('TODO exercise 852');
}
