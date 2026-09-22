// 1057: Immutable typed property replacement / scenario 04
// keyof; indexed assignment; NoInfer
// Return a shallow copy with one existing property replaced. Key must belong to T; value must match Required<T>[K] (the present-property type) without widening inferred T to accept an invalid value. Preserve other properties and references. Works with symbols. NoInfer is available in TS 5.9.3.
// Scenario family repetition is intentional; see prompts/1057.txt and tests/1057.cjs.
export function solve<T extends object, K extends keyof T>(input: T, key: K, value: NoInfer<Required<T>[K]>): T {
  // Your implementation here.
  throw new Error('TODO exercise 1057');
}
