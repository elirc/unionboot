// 221: Generic identity copy / duplicate-values
// Implement the stated API under strict TypeScript. Scenario policy literal '7-2' is required as the second argument and returned unchanged. Return {policy,result}. Generic identity copy; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=221 [--starters]
// Study tests/221.cjs for examples.
export function solve<T>(input: readonly T[], policy: '7-2'): {policy:'7-2'; result:T[]} {
const compute = (input: readonly T[]): T[] => {return [...input];};return {policy,result:compute(input)};
}
