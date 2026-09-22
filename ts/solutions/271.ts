// 271: Readonly input reversal / duplicate-values
// Implement the stated API under strict TypeScript. Scenario policy literal '17-2' is required as the second argument and returned unchanged. Return {policy,result}. Readonly input reversal; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=271 [--starters]
// Study tests/271.cjs for examples.
export function solve<T>(input: readonly T[], policy: '17-2'): {policy:'17-2'; result:T[]} {
const compute = (input: readonly T[]): T[] => {return [...input].reverse();};return {policy,result:compute(input)};
}
