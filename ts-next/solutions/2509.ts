// 2509: Contravariant consumer narrowing / consumer-input-fields=name
// in variance annotations; callback substitution
export type Model={ name: string };
export interface Consumer<in T>{readonly accept:(value:T)=>void;}
export function solve(consumer:Consumer<Partial<Model>>): Consumer<Model> {
  return {accept:value=>{consumer.accept(value);}};
}
