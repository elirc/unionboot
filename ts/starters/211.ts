// 211: Typed Result mean / duplicate-values
// Implement the stated API under strict TypeScript. Scenario policy literal '5-2' is required as the second argument and returned unchanged. Return {policy,result}. Typed Result mean; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=211 [--starters]
// Study tests/211.cjs for examples.
export function solve(input: readonly number[], policy: '5-2'): {policy:'5-2'; result:{ok:true;value:number}|{ok:false;error:'empty'}} {
throw new Error('TODO exercise 211');
}
