// 2621: Keyed all-settled outcome maps / settled-keys=tags
// mapped object Awaited; rejection unknown; key retention
export type Input={tags:PromiseLike<readonly string[]>};
export type Outcome<T>={status:'fulfilled';value:T}|{status:'rejected';reason:unknown};
export type Output={[K in keyof Input]:Outcome<Awaited<Input[K]>>};
export function solve(input:Input): Promise<Output> {
  return (async()=>{const entries=await Promise.all(Object.entries(input).map(async([key,value])=>{try{return [key,{status:'fulfilled',value:await value}] as const;}catch(reason:unknown){return [key,{status:'rejected',reason}] as const;}}));return Object.fromEntries(entries) as Output;})();
}
