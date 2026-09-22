// 234: Exclude negative numbers / basic
// Implement the stated API under strict TypeScript. Scenario policy literal '10-0' is required as the second argument and returned unchanged. Return {policy,result}. Exclude negative numbers; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=234 [--starters]
// Study tests/234.cjs for examples.
export function solve(input: readonly number[], policy: '10-0'): {policy:'10-0'; result:number[]} {
const compute =  (input: readonly number[]): number[] => {return input.filter(n=>n>=0);};return {policy,result:compute(input)};
}
