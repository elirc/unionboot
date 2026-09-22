// 893: Predicate-directed extraction / scenario 05
// user-defined type guards; generic subtypes
// Filter with a user-defined type predicate. Preserve the narrowed subtype in the return type rather than returning the original union. Do not mutate the input.
// Scenario family repetition is intentional; see prompts/893.txt and tests/893.cjs.
export function solve<T, S extends T>(items: readonly T[], guard: (item: T) => item is S): S[] {
  // Your implementation here.
  throw new Error('TODO exercise 893');
}
