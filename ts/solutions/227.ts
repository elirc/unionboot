// 227: Generic pair each element / negative-values
// Implement the stated API under strict TypeScript. Scenario policy literal '8-3' is required as the second argument and returned unchanged. Return {policy,result}. Generic pair each element; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=227 [--starters]
// Study tests/227.cjs for examples.
export function solve<T>(input: readonly T[], policy: '8-3'): {policy:'8-3'; result:[T,T][]} {
const compute = (input: readonly T[]): [T,T][] => {return input.map(value=>[value,value]);};return {policy,result:compute(input)};
}
