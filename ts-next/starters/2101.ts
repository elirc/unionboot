// 2101: Positional reverse tuple contracts / heterogeneous-arity=13
// tuple right inference; reversed position correspondence
export type Input=readonly [number, string, boolean, number, string, boolean, number, string, boolean, number, string, boolean, number];
export type Reverse<T extends readonly unknown[]>=T extends readonly [infer H,...infer R]?readonly [...Reverse<R>,H]:readonly [];
export type Output=Reverse<Input>;
export function solve(input:Input): Output {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2101');
}
