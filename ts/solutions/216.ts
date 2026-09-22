// 216: Record frequency index / duplicate-values
// Implement the stated API under strict TypeScript. Scenario policy literal '6-2' is required as the second argument and returned unchanged. Return {policy,result}. Record frequency index; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=216 [--starters]
// Study tests/216.cjs for examples.
export function solve(input: readonly number[], policy: '6-2'): {policy:'6-2'; result:Record<string,number>} {
const compute =  (input: readonly number[]): Record<string,number> => {const out:Record<string,number>={};for(const n of input){const k=String(n);out[k]=(out[k]??0)+1;}return out;};return {policy,result:compute(input)};
}
