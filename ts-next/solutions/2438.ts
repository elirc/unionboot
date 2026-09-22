// 2438: Depth-limited patch materialization / patch-depth=5
// recursive Partial; exact optional boundaries
export type Model={next:{next:{next:{next:{next:{leaf:number}}}}}};
export type Patch<T,C extends unknown[]=[]>=C['length'] extends 5?T:T extends object?{[K in keyof T]?:Patch<T[K],[...C,unknown]>}:T;
export function solve(patch:Patch<Model>): Model {
  function merge(base:unknown,change:unknown,depth:number):unknown{if(depth===5||typeof base!=='object'||base===null)return change===undefined?base:change;const out:Record<string,unknown>={};for(const key of Object.keys(base)){const next=change!==null&&typeof change==='object'&&Object.hasOwn(change,key)?Reflect.get(change,key):undefined;out[key]=merge(Reflect.get(base,key),next,depth+1);}return out;}return merge({"next":{"next":{"next":{"next":{"next":{"leaf":7}}}}}},patch,0) as Model;
}
