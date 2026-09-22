// 273: Readonly input reversal / large-values
// Implement the stated API under strict TypeScript. Scenario policy literal '17-4' is required as the second argument and returned unchanged. Return {policy,result}. Readonly input reversal; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=273 [--starters]
// Study tests/273.cjs for examples.
export function solve<T>(input: readonly T[], policy: '17-4'): {policy:'17-4'; result:T[]} {
throw new Error('TODO exercise 273');
}
