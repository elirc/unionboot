// 2641: Finite retry-attempt contracts / maximum-attempts=13
// numeric literal unions; typed retry callbacks; failure boundaries
export type Attempt=1|2|3|4|5|6|7|8|9|10|11|12|13;
export type Outcome<T>={ok:true;value:T;attempt:Attempt}|{ok:false;error:unknown;attempts:13};
export function solve<T>(work:(attempt:Attempt)=>T|PromiseLike<T>): Promise<Outcome<Awaited<T>>> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2641');
}
