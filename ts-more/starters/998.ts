// 998: Unknown string array guard / scenario 05
// type predicates; unknown; readonly arrays
// Return a type predicate recognizing arrays whose every element is a primitive string. Empty arrays pass. Sparse holes count as undefined and must fail. Do not coerce elements; do not mutate the input. Successful narrowing exposes a readonly string array.
// Scenario family repetition is intentional; see prompts/998.txt and tests/998.cjs.
export function solve(input: unknown): input is readonly string[] {
  // Your implementation here.
  throw new Error('TODO exercise 998');
}
