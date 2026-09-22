// 280: Typed running product / empty-boundary
// Implement the stated API under strict TypeScript. Scenario policy literal '19-1' is required as the second argument and returned unchanged. Return {policy,result}. Typed running product; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=280 [--starters]
// Study tests/280.cjs for examples.
export function solve(input: readonly number[], policy: '19-1'): {policy:'19-1'; result:number[]} {
const compute =  (input: readonly number[]): number[] => {let product=1;return input.map(n=>product*=n);};return {policy,result:compute(input)};
}
