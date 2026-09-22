// 1064: Immutable typed property replacement / scenario 11
// keyof; indexed assignment; NoInfer
// Return a shallow copy with one existing property replaced. Key must belong to T; value must match Required<T>[K] (the present-property type) without widening inferred T to accept an invalid value. Preserve other properties and references. Works with symbols. NoInfer is available in TS 5.9.3.
// Scenario family repetition is intentional; see prompts/1064.txt and tests/1064.cjs.
export function solve<T extends object, K extends keyof T>(input: T, key: K, value: NoInfer<Required<T>[K]>): T {
  return {...input,[key]:value};
}
