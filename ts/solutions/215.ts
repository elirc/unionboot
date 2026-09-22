// 215: Record frequency index / empty-boundary
// Implement the stated API under strict TypeScript. Scenario policy literal '6-1' is required as the second argument and returned unchanged. Return {policy,result}. Record frequency index; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=215 [--starters]
// Study tests/215.cjs for examples.
export function solve(input: readonly number[], policy: '6-1'): {policy:'6-1'; result:Record<string,number>} {
const compute =  (input: readonly number[]): Record<string,number> => {const out:Record<string,number>={};for(const n of input){const k=String(n);out[k]=(out[k]??0)+1;}return out;};return {policy,result:compute(input)};
}
