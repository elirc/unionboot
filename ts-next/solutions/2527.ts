// 2527: Invariant read-write cell copies / cell-value-fields=active
// in out variance annotations; isolated mutable state
export type Model={ active: boolean };
export interface Cell<in out T>{get:()=>T;set:(value:T)=>void;}
export function solve(initial:Model): Cell<Model> {
  let current=initial;return {get:()=>current,set:value=>{current=value;}};
}
