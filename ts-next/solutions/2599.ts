// 2599: Index-tagged promise races / race-participants=1
// mapped tuple unions; Promise combinator attribution
export type Input=readonly [PromiseLike<number>];
export type Winner={readonly index:0;readonly value:number};
export function solve(inputs:Input): Promise<Winner> {
  return Promise.race(inputs.map((input,index)=>Promise.resolve<number|string>(input).then(value=>({index,value})))) as Promise<Winner>;
}
