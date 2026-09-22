// 193: Map to labelled records / large-values
// Implement the stated API under strict TypeScript. Scenario policy literal '1-4' is required as the second argument and returned unchanged. Return {policy,result}. Map to labelled records; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=193 [--starters]
// Study tests/193.cjs for examples.
export function solve(input: readonly number[], policy: '1-4'): {policy:'1-4'; result:{index:number; value:number}[]} {
const compute =  (input: readonly number[]): {index:number; value:number}[] => {return input.map((value,index)=>({index,value}));};return {policy,result:compute(input)};
}
