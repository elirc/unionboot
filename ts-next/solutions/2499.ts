// 2499: Covariant producer widening / producer-output-fields=count+active
// out variance annotations; readonly production contracts
export type Model={ count: number; active: boolean };
export interface Producer<out T>{readonly get:()=>T;}
export type View=Producer<Model>;
export function solve(producer:View): Producer<Partial<Model>> {
  return {get:()=>producer.get()};
}
