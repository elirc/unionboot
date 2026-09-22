// 2094: Positional reverse tuple contracts / heterogeneous-arity=6
// tuple right inference; reversed position correspondence
export type Input=readonly [number, string, boolean, number, string, boolean];
export type Reverse<T extends readonly unknown[]>=T extends readonly [infer H,...infer R]?readonly [...Reverse<R>,H]:readonly [];
export type Output=Reverse<Input>;
export function solve(input:Input): Output {
  return [...input].reverse() as unknown as Output;
}
