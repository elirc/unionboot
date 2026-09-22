// 2224: Query-template placeholder interpolation / query-placeholder-arity=1
// template infer records; URLSearchParams value encoding
export type Template="k1={v1}";
export type Variables<S extends string>=S extends `${string}{${infer K}}${infer Rest}`?{[P in K|keyof Variables<Rest>]:string}:{};
export type Input=Variables<Template>;
export function solve(values:Input): string {
  return "k1={v1}".replace(/{([^}]+)}/g,(_,key:string)=>encodeURIComponent(values[key as keyof Input]));
}
