// 2535: Invariant read-write cell copies / cell-value-fields=active+tags
// in out variance annotations; isolated mutable state
export type Model={ active: boolean; tags: readonly string[] };
export interface Cell<in out T>{get:()=>T;set:(value:T)=>void;}
export function solve(initial:Model): Cell<Model> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2535');
}
