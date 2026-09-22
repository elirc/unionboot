// 2611: Index-tagged promise races / race-participants=13
// mapped tuple unions; Promise combinator attribution
export type Input=readonly [PromiseLike<number>, PromiseLike<string>, PromiseLike<number>, PromiseLike<string>, PromiseLike<number>, PromiseLike<string>, PromiseLike<number>, PromiseLike<string>, PromiseLike<number>, PromiseLike<string>, PromiseLike<number>, PromiseLike<string>, PromiseLike<number>];
export type Winner={readonly index:0;readonly value:number}|{readonly index:1;readonly value:string}|{readonly index:2;readonly value:number}|{readonly index:3;readonly value:string}|{readonly index:4;readonly value:number}|{readonly index:5;readonly value:string}|{readonly index:6;readonly value:number}|{readonly index:7;readonly value:string}|{readonly index:8;readonly value:number}|{readonly index:9;readonly value:string}|{readonly index:10;readonly value:number}|{readonly index:11;readonly value:string}|{readonly index:12;readonly value:number};
export function solve(inputs:Input): Promise<Winner> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2611');
}
