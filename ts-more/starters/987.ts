// 987: Unknown record decoder / scenario 09
// unknown object narrowing; exact optional properties
// Decode a plain data-shaped unknown object: own nonblank string name, optional own nonnegative safe-integer age. Trim name and strip extra properties. An own age:undefined is invalid; absent age stays absent. Arrays/null/nonobjects fail record. Validation order: record,name,age. Ignore inherited fields. Assume no throwing getters/proxies.
// Scenario family repetition is intentional; see prompts/987.txt and tests/987.cjs.
export type Person = {name:string; age?:number};
export type Decode = {ok:true; value:Person} | {ok:false; error:'record'|'name'|'age'};
export function solve(input: unknown): Decode {
  // Your implementation here.
  throw new Error('TODO exercise 987');
}
