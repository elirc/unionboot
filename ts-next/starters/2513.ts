// 2513: Contravariant consumer narrowing / consumer-input-fields=name+active
// in variance annotations; callback substitution
export type Model={ name: string; active: boolean };
export interface Consumer<in T>{readonly accept:(value:T)=>void;}
export function solve(consumer:Consumer<Partial<Model>>): Consumer<Model> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2513');
}
