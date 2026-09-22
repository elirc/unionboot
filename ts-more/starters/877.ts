// 877: Nullish compaction / scenario 04
// NonNullable; type guards; unions
// Remove only null and undefined. Keep falsy but present values (0, false, empty string, NaN). Return a NonNullable element array without asserting that every falsy value is absent.
// Scenario family repetition is intentional; see prompts/877.txt and tests/877.cjs.
export function solve<T>(items: readonly T[]): NonNullable<T>[] {
  // Your implementation here.
  throw new Error('TODO exercise 877');
}
