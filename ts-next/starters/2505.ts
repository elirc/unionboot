// 2505: Covariant producer widening / producer-output-fields=active+tags
// out variance annotations; readonly production contracts
export type Model={ active: boolean; tags: readonly string[] };
export interface Producer<out T>{readonly get:()=>T;}
export type View=Producer<Model>;
export function solve(producer:View): Producer<Partial<Model>> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2505');
}
