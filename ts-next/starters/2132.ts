// 2132: Route-template parameter binding / route-parameters=14
// template literal parsing; inferred parameter records
export type Route="/users/:p1/:p2/:p3/:p4/:p5/:p6/:p7/:p8/:p9/:p10/:p11/:p12/:p13/:p14";
export type Params<S extends string>=S extends `${string}:${infer K}/${infer R}`?{[P in K|keyof Params<R>]:string}:S extends `${string}:${infer K}`?{[P in K]:string}:{};
export type Input=Params<Route>;
export function solve(params:Input): string {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2132');
}
