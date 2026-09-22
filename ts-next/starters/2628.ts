// 2628: Keyed all-settled outcome maps / settled-keys=name+count+active+tags
// mapped object Awaited; rejection unknown; key retention
export type Input={name:PromiseLike<string>;count:PromiseLike<number>;active:PromiseLike<boolean>;tags:PromiseLike<readonly string[]>};
export type Outcome<T>={status:'fulfilled';value:T}|{status:'rejected';reason:unknown};
export type Output={[K in keyof Input]:Outcome<Awaited<Input[K]>>};
export function solve(input:Input): Promise<Output> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2628');
}
