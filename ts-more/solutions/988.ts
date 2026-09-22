// 988: Unknown record decoder / scenario 10
// unknown object narrowing; exact optional properties
// Decode a plain data-shaped unknown object: own nonblank string name, optional own nonnegative safe-integer age. Trim name and strip extra properties. An own age:undefined is invalid; absent age stays absent. Arrays/null/nonobjects fail record. Validation order: record,name,age. Ignore inherited fields. Assume no throwing getters/proxies.
// Scenario family repetition is intentional; see prompts/988.txt and tests/988.cjs.
export type Person = {name:string; age?:number};
export type Decode = {ok:true; value:Person} | {ok:false; error:'record'|'name'|'age'};
export function solve(input: unknown): Decode {
  if(typeof input!=='object'||input===null||Array.isArray(input)) return {ok:false,error:'record'}; if(!Object.hasOwn(input,'name')||!('name' in input)||typeof input.name!=='string'||input.name.trim()==='') return {ok:false,error:'name'}; const value:Person={name:input.name.trim()}; if(Object.hasOwn(input,'age')) { if(!('age' in input)||typeof input.age!=='number'||!Number.isSafeInteger(input.age)||input.age<0) return {ok:false,error:'age'}; value.age=input.age; } return {ok:true,value};
}
