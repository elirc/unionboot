// 1167: Nullish fallback without falsy loss / scenario 09
// generic inference; nullish unions; NoInfer
// Use fallback only when value is null or undefined. Preserve false, zero, empty string and NaN. The fallback must match the explicitly supplied/inferred T rather than broadening it. Pass a type argument when the only value available is null.
// Scenario family repetition is intentional; see prompts/1167.txt and tests/1167.cjs.
export function solve<T>(value:T|null|undefined, fallback:NoInfer<T>): T {
  // Your implementation here.
  throw new Error('TODO exercise 1167');
}
