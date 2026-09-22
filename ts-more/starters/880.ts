// 880: Nullish compaction / scenario 07
// NonNullable; type guards; unions
// Remove only null and undefined. Keep falsy but present values (0, false, empty string, NaN). Return a NonNullable element array without asserting that every falsy value is absent.
// Scenario family repetition is intentional; see prompts/880.txt and tests/880.cjs.
export function solve<T>(items: readonly T[]): NonNullable<T>[] {
  // Your implementation here.
  throw new Error('TODO exercise 880');
}
