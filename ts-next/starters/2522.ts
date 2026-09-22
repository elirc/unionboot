// 2522: Contravariant consumer narrowing / consumer-input-fields=count+active+tags
// in variance annotations; callback substitution
export type Model={ count: number; active: boolean; tags: readonly string[] };
export interface Consumer<in T>{readonly accept:(value:T)=>void;}
export function solve(consumer:Consumer<Partial<Model>>): Consumer<Model> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2522');
}
