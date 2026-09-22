// 262: Typed sorted set / negative-values
// Implement the stated API under strict TypeScript. Scenario policy literal '15-3' is required as the second argument and returned unchanged. Return {policy,result}. Typed sorted set; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=262 [--starters]
// Study tests/262.cjs for examples.
export function solve(input: readonly number[], policy: '15-3'): {policy:'15-3'; result:number[]} {
const compute =  (input: readonly number[]): number[] => {return [...new Set(input)].sort((a,b)=>a-b);};return {policy,result:compute(input)};
}
