// 2520: Contravariant consumer narrowing / consumer-input-fields=active+tags
// in variance annotations; callback substitution
export type Model={ active: boolean; tags: readonly string[] };
export interface Consumer<in T>{readonly accept:(value:T)=>void;}
export function solve(consumer:Consumer<Partial<Model>>): Consumer<Model> {
  return {accept:value=>{consumer.accept(value);}};
}
