// 843: Key-safe property projection / scenario 15
// keyof; indexed access; generic constraints
// Project a property from each record in order. The key must belong to the record type; preserve the selected property type including undefined for optional fields. Readonly arrays and symbol keys are supported.
// Scenario family repetition is intentional; see prompts/843.txt and tests/843.cjs.
export function solve<T, K extends keyof T>(items: readonly T[], key: K): T[K][] {
  return items.map(item => item[key]);
}
