// 272: Readonly input reversal / negative-values
// Implement the stated API under strict TypeScript. Scenario policy literal '17-3' is required as the second argument and returned unchanged. Return {policy,result}. Readonly input reversal; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=272 [--starters]
// Study tests/272.cjs for examples.
export function solve<T>(input: readonly T[], policy: '17-3'): {policy:'17-3'; result:T[]} {
const compute = (input: readonly T[]): T[] => {return [...input].reverse();};return {policy,result:compute(input)};
}
