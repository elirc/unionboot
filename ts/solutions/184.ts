// 184: Sum readonly numbers / basic
// Implement the stated API under strict TypeScript. Scenario policy literal '0-0' is required as the second argument and returned unchanged. Return {policy,result}. Sum readonly numbers; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=184 [--starters]
// Study tests/184.cjs for examples.
export function solve(input: readonly number[], policy: '0-0'): {policy:'0-0'; result:number} {
const compute =  (input: readonly number[]): number => {return input.reduce((sum,n)=>sum+n,0);};return {policy,result:compute(input)};
}
