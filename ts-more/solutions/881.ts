// 881: Nullish compaction / scenario 08
// NonNullable; type guards; unions
// Remove only null and undefined. Keep falsy but present values (0, false, empty string, NaN). Return a NonNullable element array without asserting that every falsy value is absent.
// Scenario family repetition is intentional; see prompts/881.txt and tests/881.cjs.
export function solve<T>(items: readonly T[]): NonNullable<T>[] {
  return items.filter((item): item is NonNullable<T> => item !== null && item !== undefined);
}
