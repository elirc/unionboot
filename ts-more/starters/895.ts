// 895: Predicate-directed extraction / scenario 07
// user-defined type guards; generic subtypes
// Filter with a user-defined type predicate. Preserve the narrowed subtype in the return type rather than returning the original union. Do not mutate the input.
// Scenario family repetition is intentional; see prompts/895.txt and tests/895.cjs.
export function solve<T, S extends T>(items: readonly T[], guard: (item: T) => item is S): S[] {
  // Your implementation here.
  throw new Error('TODO exercise 895');
}
