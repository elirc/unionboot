// 829: Key-safe property projection / scenario 01
// keyof; indexed access; generic constraints
// Project a property from each record in order. The key must belong to the record type; preserve the selected property type including undefined for optional fields. Readonly arrays and symbol keys are supported.
// Scenario family repetition is intentional; see prompts/829.txt and tests/829.cjs.
export function solve<T, K extends keyof T>(items: readonly T[], key: K): T[K][] {
  // Your implementation here.
  throw new Error('TODO exercise 829');
}
