// 1232: Typed asynchronous Result capture / scenario 14
// Promise; unknown catch values; generic Awaited
// Invoke a sync or async thunk once and await its result. Convert throws/rejections into an error:unknown result, preserving the original thrown value. Successful results use Awaited<T>. Never assume thrown values are Error objects.
// Scenario family repetition is intentional; see prompts/1232.txt and tests/1232.cjs.
export type Result<T> = {ok:true;value:T}|{ok:false;error:unknown};
export function solve<T>(work:()=>T|PromiseLike<T>): Promise<Result<Awaited<T>>> {
  // Your implementation here.
  throw new Error('TODO exercise 1232');
}
