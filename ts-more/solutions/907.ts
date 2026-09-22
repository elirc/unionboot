// 907: First typed search result / scenario 04
// discriminated unions; generic payloads
// Return the first matching value and index using a found discriminant. A present undefined value is still a match. Stop calling the predicate after success. Missing result contains only found:false.
// Scenario family repetition is intentional; see prompts/907.txt and tests/907.cjs.
export type SearchResult<T> = {found:true; value:T; index:number} | {found:false};
export function solve<T>(items: readonly T[], predicate: (item:T) => boolean): SearchResult<T> {
  for(let index=0;index<items.length;index++) { const value=items[index]!; if(predicate(value)) return {found:true,value,index}; } return {found:false};
}
