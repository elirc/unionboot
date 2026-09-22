// 1227: Typed asynchronous Result capture / scenario 09
// Promise; unknown catch values; generic Awaited
// Invoke a sync or async thunk once and await its result. Convert throws/rejections into an error:unknown result, preserving the original thrown value. Successful results use Awaited<T>. Never assume thrown values are Error objects.
// Scenario family repetition is intentional; see prompts/1227.txt and tests/1227.cjs.
export type Result<T> = {ok:true;value:T}|{ok:false;error:unknown};
export function solve<T>(work:()=>T|PromiseLike<T>): Promise<Result<Awaited<T>>> {
  return (async()=>{try{return {ok:true,value:await work()};}catch(error:unknown){return {ok:false,error};}})();
}
