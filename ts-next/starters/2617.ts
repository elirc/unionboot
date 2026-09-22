// 2617: Keyed all-settled outcome maps / settled-keys=active
// mapped object Awaited; rejection unknown; key retention
export type Input={active:PromiseLike<boolean>};
export type Outcome<T>={status:'fulfilled';value:T}|{status:'rejected';reason:unknown};
export type Output={[K in keyof Input]:Outcome<Awaited<Input[K]>>};
export function solve(input:Input): Promise<Output> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2617');
}
