// 1239: Sequential typed async mapping / scenario 06
// async generics; readonly inputs; sequencing
// Map items sequentially: await each result before starting the next. Preserve output order and inferred awaited element type. Stop on the first thrown/rejected callback and propagate its value. Empty resolves [].
// Scenario family repetition is intentional; see prompts/1239.txt and tests/1239.cjs.
export function solve<T,U>(items:readonly T[], map:(item:T,index:number)=>U|PromiseLike<U>): Promise<Awaited<U>[]> {
  return (async()=>{const out:Awaited<U>[]=[];for(let i=0;i<items.length;i++)out.push(await map(items[i]!,i));return out;})();
}
