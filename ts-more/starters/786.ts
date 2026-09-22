// 786: Stable generic partition / scenario 03
// generics; readonly inputs; callback variance
// Return [accepted,rejected], preserving order and references. Call predicate exactly once per element with its zero-based index. Empty input gives two empty arrays; do not mutate input.
// Scenario family repetition is intentional; see prompts/786.txt and tests/786.cjs.
export function solve<T>(items: readonly T[], predicate: (item: T, index: number) => boolean): [T[], T[]] {
  // Your implementation here.
  throw new Error('TODO exercise 786');
}
