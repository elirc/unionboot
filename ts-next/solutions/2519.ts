// 2519: Contravariant consumer narrowing / consumer-input-fields=name+count+tags
// in variance annotations; callback substitution
export type Model={ name: string; count: number; tags: readonly string[] };
export interface Consumer<in T>{readonly accept:(value:T)=>void;}
export function solve(consumer:Consumer<Partial<Model>>): Consumer<Model> {
  return {accept:value=>{consumer.accept(value);}};
}
