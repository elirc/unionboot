// 945: Collect successful Results / scenario 12
// union narrowing; error accumulation; tuples
// Partition successful payloads and errors in arrival order, discarding neither. Empty returns two empty arrays. Preserve payload/error references and narrow on ok, not on truthiness of payload.
// Scenario family repetition is intentional; see prompts/945.txt and tests/945.cjs.
export type Result<T,E> = {ok:true; value:T} | {ok:false; error:E};
export function solve<T, E>(results: readonly Result<T,E>[]): {values:T[]; errors:E[]} {
  const values:T[]=[],errors:E[]=[]; for(const result of results) { if(result.ok) values.push(result.value); else errors.push(result.error); } return {values,errors};
}
