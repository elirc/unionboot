// 266: Discriminated parity labels / duplicate-values
// Implement the stated API under strict TypeScript. Scenario policy literal '16-2' is required as the second argument and returned unchanged. Return {policy,result}. Discriminated parity labels; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=266 [--starters]
// Study tests/266.cjs for examples.
export function solve(input: readonly number[], policy: '16-2'): {policy:'16-2'; result:{value:number;parity:'even'|'odd'}[]} {
const compute =  (input: readonly number[]): {value:number;parity:'even'|'odd'}[] => {return input.map(value=>({value,parity:value%2===0?'even':'odd'}));};return {policy,result:compute(input)};
}
