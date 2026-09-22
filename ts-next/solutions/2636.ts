// 2636: Finite retry-attempt contracts / maximum-attempts=8
// numeric literal unions; typed retry callbacks; failure boundaries
export type Attempt=1|2|3|4|5|6|7|8;
export type Outcome<T>={ok:true;value:T;attempt:Attempt}|{ok:false;error:unknown;attempts:8};
export function solve<T>(work:(attempt:Attempt)=>T|PromiseLike<T>): Promise<Outcome<Awaited<T>>> {
  return (async()=>{let error:unknown;for(let i=1;i<=8;i++){try{return {ok:true,value:await work(i as Attempt),attempt:i as Attempt};}catch(caught:unknown){error=caught;}}return {ok:false,error,attempts:8};})();
}
