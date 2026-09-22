// 205: Readonly tuple bounds / empty-boundary
// Implement the stated API under strict TypeScript. Scenario policy literal '4-1' is required as the second argument and returned unchanged. Return {policy,result}. Readonly tuple bounds; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=205 [--starters]
// Study tests/205.cjs for examples.
export function solve(input: readonly number[], policy: '4-1'): {policy:'4-1'; result:readonly [number,number] | null} {
const compute =  (input: readonly number[]): readonly [number,number] | null => {return input.length?[Math.min(...input),Math.max(...input)] as const:null;};return {policy,result:compute(input)};
}
