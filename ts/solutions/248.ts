// 248: Tuple neighbouring differences / large-values
// Implement the stated API under strict TypeScript. Scenario policy literal '12-4' is required as the second argument and returned unchanged. Return {policy,result}. Tuple neighbouring differences; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=248 [--starters]
// Study tests/248.cjs for examples.
export function solve(input: readonly number[], policy: '12-4'): {policy:'12-4'; result:[number,number,number][]} {
const compute =  (input: readonly number[]): [number,number,number][] => {return input.slice(1).map((n,i)=>[input[i]!,n,n-input[i]!]);};return {policy,result:compute(input)};
}
