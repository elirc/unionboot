// 2497: Covariant producer widening / producer-output-fields=active
// out variance annotations; readonly production contracts
export type Model={ active: boolean };
export interface Producer<out T>{readonly get:()=>T;}
export type View=Producer<Model>;
export function solve(producer:View): Producer<Partial<Model>> {
  return {get:()=>producer.get()};
}
