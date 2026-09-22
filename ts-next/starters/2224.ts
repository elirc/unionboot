// 2224: Query-template placeholder interpolation / query-placeholder-arity=1
// template infer records; URLSearchParams value encoding
export type Template="k1={v1}";
export type Variables<S extends string>=S extends `${string}{${infer K}}${infer Rest}`?{[P in K|keyof Variables<Rest>]:string}:{};
export type Input=Variables<Template>;
export function solve(values:Input): string {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2224');
}
