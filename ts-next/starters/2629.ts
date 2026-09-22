// 2629: Finite retry-attempt contracts / maximum-attempts=1
// numeric literal unions; typed retry callbacks; failure boundaries
export type Attempt=1;
export type Outcome<T>={ok:true;value:T;attempt:Attempt}|{ok:false;error:unknown;attempts:1};
export function solve<T>(work:(attempt:Attempt)=>T|PromiseLike<T>): Promise<Outcome<Awaited<T>>> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2629');
}
