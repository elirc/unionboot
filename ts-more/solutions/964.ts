// 964: Unknown finite number decoder / scenario 01
// unknown boundaries; typeof narrowing; Result
// Decode unknown without coercion. Only finite primitive numbers succeed, including zero and negative zero. Wrong type reports not-number, NaN/infinities report not-finite. Return a discriminated result; do not throw on ordinary invalid input.
// Scenario family repetition is intentional; see prompts/964.txt and tests/964.cjs.
export type Decode = {ok:true; value:number} | {ok:false; error:'not-number'|'not-finite'};
export function solve(input: unknown): Decode {
  if(typeof input !== 'number') return {ok:false,error:'not-number'}; if(!Number.isFinite(input)) return {ok:false,error:'not-finite'}; return {ok:true,value:input};
}
