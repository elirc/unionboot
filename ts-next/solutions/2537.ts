// 2537: Invariant read-write cell copies / cell-value-fields=count+active+tags
// in out variance annotations; isolated mutable state
export type Model={ count: number; active: boolean; tags: readonly string[] };
export interface Cell<in out T>{get:()=>T;set:(value:T)=>void;}
export function solve(initial:Model): Cell<Model> {
  let current=initial;return {get:()=>current,set:value=>{current=value;}};
}
