// 2226: Query-template placeholder interpolation / query-placeholder-arity=3
// template infer records; URLSearchParams value encoding
export type Template="k1={v1}&k2={v2}&k3={v3}";
export type Variables<S extends string>=S extends `${string}{${infer K}}${infer Rest}`?{[P in K|keyof Variables<Rest>]:string}:{};
export type Input=Variables<Template>;
export function solve(values:Input): string {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2226');
}
