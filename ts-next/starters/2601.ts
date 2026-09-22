// 2601: Index-tagged promise races / race-participants=3
// mapped tuple unions; Promise combinator attribution
export type Input=readonly [PromiseLike<number>, PromiseLike<string>, PromiseLike<number>];
export type Winner={readonly index:0;readonly value:number}|{readonly index:1;readonly value:string}|{readonly index:2;readonly value:number};
export function solve(inputs:Input): Promise<Winner> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2601');
}
