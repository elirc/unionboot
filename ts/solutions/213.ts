// 213: Typed Result mean / large-values
// Implement the stated API under strict TypeScript. Scenario policy literal '5-4' is required as the second argument and returned unchanged. Return {policy,result}. Typed Result mean; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=213 [--starters]
// Study tests/213.cjs for examples.
export function solve(input: readonly number[], policy: '5-4'): {policy:'5-4'; result:{ok:true;value:number}|{ok:false;error:'empty'}} {
const compute =  (input: readonly number[]): {ok:true;value:number}|{ok:false;error:'empty'} => {return input.length?{ok:true,value:input.reduce((s,n)=>s+n,0)/input.length}:{ok:false,error:'empty'};};return {policy,result:compute(input)};
}
