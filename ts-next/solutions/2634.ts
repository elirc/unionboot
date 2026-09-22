// 2634: Finite retry-attempt contracts / maximum-attempts=6
// numeric literal unions; typed retry callbacks; failure boundaries
export type Attempt=1|2|3|4|5|6;
export type Outcome<T>={ok:true;value:T;attempt:Attempt}|{ok:false;error:unknown;attempts:6};
export function solve<T>(work:(attempt:Attempt)=>T|PromiseLike<T>): Promise<Outcome<Awaited<T>>> {
  return (async()=>{let error:unknown;for(let i=1;i<=6;i++){try{return {ok:true,value:await work(i as Attempt),attempt:i as Attempt};}catch(caught:unknown){error=caught;}}return {ok:false,error,attempts:6};})();
}
