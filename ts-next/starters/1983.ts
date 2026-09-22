// 1983: Bounded infer-chain box peeling / peel-budget=15
// conditional infer chains; recursion fuel; terminal values
export type Peel<T, Fuel extends unknown[] = [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]> = Fuel extends [unknown,...infer Rest] ? T extends {readonly value:infer V} ? Peel<V,Rest> : T : T;
export function solve<const T>(input: T): Peel<T> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 1983');
}
