// 222: Generic identity copy / negative-values
// Implement the stated API under strict TypeScript. Scenario policy literal '7-3' is required as the second argument and returned unchanged. Return {policy,result}. Generic identity copy; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=222 [--starters]
// Study tests/222.cjs for examples.
export function solve<T>(input: readonly T[], policy: '7-3'): {policy:'7-3'; result:T[]} {
const compute = (input: readonly T[]): T[] => {return [...input];};return {policy,result:compute(input)};
}
