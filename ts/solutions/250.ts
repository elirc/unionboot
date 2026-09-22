// 250: Union numeric parser / empty-boundary
// Implement the stated API under strict TypeScript. Scenario policy literal '13-1' is required as the second argument and returned unchanged. Return {policy,result}. Union numeric parser; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=250 [--starters]
// Study tests/250.cjs for examples.
export function solve(input: readonly (number|string)[], policy: '13-1'): {policy:'13-1'; result:number[]} {
const compute =  (input: readonly (number|string)[]): number[] => {return input.map(n=>{const value=typeof n==='number'?n:Number(n);if(!Number.isFinite(value))throw new Error('Invalid number');return value;});};return {policy,result:compute(input)};
}
