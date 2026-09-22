// 242: Cumulative typed records / negative-values
// Implement the stated API under strict TypeScript. Scenario policy literal '11-3' is required as the second argument and returned unchanged. Return {policy,result}. Cumulative typed records; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=242 [--starters]
// Study tests/242.cjs for examples.
export function solve(input: readonly number[], policy: '11-3'): {policy:'11-3'; result:{input:number;total:number}[]} {
const compute =  (input: readonly number[]): {input:number;total:number}[] => {let total=0;return input.map(n=>({input:n,total:total+=n}));};return {policy,result:compute(input)};
}
