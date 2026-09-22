// 934: Collect successful Results / scenario 01
// union narrowing; error accumulation; tuples
// Partition successful payloads and errors in arrival order, discarding neither. Empty returns two empty arrays. Preserve payload/error references and narrow on ok, not on truthiness of payload.
// Scenario family repetition is intentional; see prompts/934.txt and tests/934.cjs.
export type Result<T,E> = {ok:true; value:T} | {ok:false; error:E};
export function solve<T, E>(results: readonly Result<T,E>[]): {values:T[]; errors:E[]} {
  // Your implementation here.
  throw new Error('TODO exercise 934');
}
