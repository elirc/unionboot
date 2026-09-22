// 269: Readonly input reversal / basic
// Implement the stated API under strict TypeScript. Scenario policy literal '17-0' is required as the second argument and returned unchanged. Return {policy,result}. Readonly input reversal; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=269 [--starters]
// Study tests/269.cjs for examples.
export function solve<T>(input: readonly T[], policy: '17-0'): {policy:'17-0'; result:T[]} {
const compute = (input: readonly T[]): T[] => {return [...input].reverse();};return {policy,result:compute(input)};
}
