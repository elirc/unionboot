// 1240: Sequential typed async mapping / scenario 07
// async generics; readonly inputs; sequencing
// Map items sequentially: await each result before starting the next. Preserve output order and inferred awaited element type. Stop on the first thrown/rejected callback and propagate its value. Empty resolves [].
// Scenario family repetition is intentional; see prompts/1240.txt and tests/1240.cjs.
export function solve<T,U>(items:readonly T[], map:(item:T,index:number)=>U|PromiseLike<U>): Promise<Awaited<U>[]> {
  // Your implementation here.
  throw new Error('TODO exercise 1240');
}
