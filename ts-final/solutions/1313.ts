// 1313: Branded identifier validation / scenario 05
// unique symbol branding; unknown validation; nominal types
// Validate usr_ followed by a positive decimal integer with no leading zero. Successful strings are branded UserId; invalid unknown inputs return invalid-id without coercion or trimming. Keep the original string. A single cast after validation creates the brand; arbitrary plain strings must not assign to UserId.
// Scenario family repetition is intentional; see prompts/1313.txt and tests/1313.cjs.
declare const idBrand:unique symbol;
export type UserId=string & {readonly [idBrand]:'UserId'};
export type Decode={ok:true;value:UserId}|{ok:false;error:'invalid-id'};
export function solve(input:unknown): Decode {
  return typeof input==='string' && /^usr_[1-9][0-9]*$/.test(input) && !input.includes('\n') && !input.includes('\r') ? {ok:true,value:input as UserId} : {ok:false,error:'invalid-id'};
}
