// 2090: Positional reverse tuple contracts / heterogeneous-arity=2
// tuple right inference; reversed position correspondence
export type Input=readonly [number, string];
export type Reverse<T extends readonly unknown[]>=T extends readonly [infer H,...infer R]?readonly [...Reverse<R>,H]:readonly [];
export type Output=Reverse<Input>;
export function solve(input:Input): Output {
  return [...input].reverse() as unknown as Output;
}
