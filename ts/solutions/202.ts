// 202: Optional first value / negative-values
// Implement the stated API under strict TypeScript. Scenario policy literal '3-3' is required as the second argument and returned unchanged. Return {policy,result}. Optional first value; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=202 [--starters]
// Study tests/202.cjs for examples.
export function solve(input: readonly number[], policy: '3-3'): {policy:'3-3'; result:number | undefined} {
const compute =  (input: readonly number[]): number | undefined => {return input[0];};return {policy,result:compute(input)};
}
