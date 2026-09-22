// 185: Sum readonly numbers / empty-boundary
// Implement the stated API under strict TypeScript. Scenario policy literal '0-1' is required as the second argument and returned unchanged. Return {policy,result}. Sum readonly numbers; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=185 [--starters]
// Study tests/185.cjs for examples.
export function solve(input: readonly number[], policy: '0-1'): {policy:'0-1'; result:number} {
const compute =  (input: readonly number[]): number => {return input.reduce((sum,n)=>sum+n,0);};return {policy,result:compute(input)};
}
