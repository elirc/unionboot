// 2121: Route-template parameter binding / route-parameters=3
// template literal parsing; inferred parameter records
export type Route="/users/:p1/:p2/:p3";
export type Params<S extends string>=S extends `${string}:${infer K}/${infer R}`?{[P in K|keyof Params<R>]:string}:S extends `${string}:${infer K}`?{[P in K]:string}:{};
export type Input=Params<Route>;
export function solve(params:Input): string {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2121');
}
