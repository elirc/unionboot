// 789: Stable generic partition / scenario 06
// generics; readonly inputs; callback variance
// Return [accepted,rejected], preserving order and references. Call predicate exactly once per element with its zero-based index. Empty input gives two empty arrays; do not mutate input.
// Scenario family repetition is intentional; see prompts/789.txt and tests/789.cjs.
export function solve<T>(items: readonly T[], predicate: (item: T, index: number) => boolean): [T[], T[]] {
  // Your implementation here.
  throw new Error('TODO exercise 789');
}
