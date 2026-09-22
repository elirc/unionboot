// 260: Typed sorted set / empty-boundary
// Implement the stated API under strict TypeScript. Scenario policy literal '15-1' is required as the second argument and returned unchanged. Return {policy,result}. Typed sorted set; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=260 [--starters]
// Study tests/260.cjs for examples.
export function solve(input: readonly number[], policy: '15-1'): {policy:'15-1'; result:number[]} {
const compute =  (input: readonly number[]): number[] => {return [...new Set(input)].sort((a,b)=>a-b);};return {policy,result:compute(input)};
}
