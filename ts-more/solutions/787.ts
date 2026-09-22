// 787: Stable generic partition / scenario 04
// generics; readonly inputs; callback variance
// Return [accepted,rejected], preserving order and references. Call predicate exactly once per element with its zero-based index. Empty input gives two empty arrays; do not mutate input.
// Scenario family repetition is intentional; see prompts/787.txt and tests/787.cjs.
export function solve<T>(items: readonly T[], predicate: (item: T, index: number) => boolean): [T[], T[]] {
  const yes: T[] = [], no: T[] = []; items.forEach((item, index) => (predicate(item, index) ? yes : no).push(item)); return [yes, no];
}
