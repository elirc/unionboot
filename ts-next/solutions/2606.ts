// 2606: Index-tagged promise races / race-participants=8
// mapped tuple unions; Promise combinator attribution
export type Input=readonly [PromiseLike<number>, PromiseLike<string>, PromiseLike<number>, PromiseLike<string>, PromiseLike<number>, PromiseLike<string>, PromiseLike<number>, PromiseLike<string>];
export type Winner={readonly index:0;readonly value:number}|{readonly index:1;readonly value:string}|{readonly index:2;readonly value:number}|{readonly index:3;readonly value:string}|{readonly index:4;readonly value:number}|{readonly index:5;readonly value:string}|{readonly index:6;readonly value:number}|{readonly index:7;readonly value:string};
export function solve(inputs:Input): Promise<Winner> {
  return Promise.race(inputs.map((input,index)=>Promise.resolve<number|string>(input).then(value=>({index,value})))) as Promise<Winner>;
}
