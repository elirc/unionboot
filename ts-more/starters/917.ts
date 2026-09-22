// 917: First typed search result / scenario 14
// discriminated unions; generic payloads
// Return the first matching value and index using a found discriminant. A present undefined value is still a match. Stop calling the predicate after success. Missing result contains only found:false.
// Scenario family repetition is intentional; see prompts/917.txt and tests/917.cjs.
export type SearchResult<T> = {found:true; value:T; index:number} | {found:false};
export function solve<T>(items: readonly T[], predicate: (item:T) => boolean): SearchResult<T> {
  // Your implementation here.
  throw new Error('TODO exercise 917');
}
