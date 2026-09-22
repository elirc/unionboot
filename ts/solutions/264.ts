// 264: Discriminated parity labels / basic
// Implement the stated API under strict TypeScript. Scenario policy literal '16-0' is required as the second argument and returned unchanged. Return {policy,result}. Discriminated parity labels; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=264 [--starters]
// Study tests/264.cjs for examples.
export function solve(input: readonly number[], policy: '16-0'): {policy:'16-0'; result:{value:number;parity:'even'|'odd'}[]} {
const compute =  (input: readonly number[]): {value:number;parity:'even'|'odd'}[] => {return input.map(value=>({value,parity:value%2===0?'even':'odd'}));};return {policy,result:compute(input)};
}
