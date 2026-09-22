// 2638: Finite retry-attempt contracts / maximum-attempts=10
// numeric literal unions; typed retry callbacks; failure boundaries
export type Attempt=1|2|3|4|5|6|7|8|9|10;
export type Outcome<T>={ok:true;value:T;attempt:Attempt}|{ok:false;error:unknown;attempts:10};
export function solve<T>(work:(attempt:Attempt)=>T|PromiseLike<T>): Promise<Outcome<Awaited<T>>> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2638');
}
