// 277: Optional object entries / negative-values
// Implement the stated API under strict TypeScript. Scenario policy literal '18-3' is required as the second argument and returned unchanged. Return {policy,result}. Optional object entries; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=277 [--starters]
// Study tests/277.cjs for examples.
export function solve(input: readonly number[], policy: '18-3'): {policy:'18-3'; result:{value:number;previous?:number}[]} {
const compute =  (input: readonly number[]): {value:number;previous?:number}[] => {return input.map((value,i)=>i===0?{value}:{value,previous:input[i-1]!});};return {policy,result:compute(input)};
}
