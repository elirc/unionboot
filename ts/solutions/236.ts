// 236: Exclude negative numbers / duplicate-values
// Implement the stated API under strict TypeScript. Scenario policy literal '10-2' is required as the second argument and returned unchanged. Return {policy,result}. Exclude negative numbers; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=236 [--starters]
// Study tests/236.cjs for examples.
export function solve(input: readonly number[], policy: '10-2'): {policy:'10-2'; result:number[]} {
const compute =  (input: readonly number[]): number[] => {return input.filter(n=>n>=0);};return {policy,result:compute(input)};
}
