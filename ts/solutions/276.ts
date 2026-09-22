// 276: Optional object entries / duplicate-values
// Implement the stated API under strict TypeScript. Scenario policy literal '18-2' is required as the second argument and returned unchanged. Return {policy,result}. Optional object entries; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=276 [--starters]
// Study tests/276.cjs for examples.
export function solve(input: readonly number[], policy: '18-2'): {policy:'18-2'; result:{value:number;previous?:number}[]} {
const compute =  (input: readonly number[]): {value:number;previous?:number}[] => {return input.map((value,i)=>i===0?{value}:{value,previous:input[i-1]!});};return {policy,result:compute(input)};
}
