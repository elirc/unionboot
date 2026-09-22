// 2228: Query-template placeholder interpolation / query-placeholder-arity=5
// template infer records; URLSearchParams value encoding
export type Template="k1={v1}&k2={v2}&k3={v3}&k4={v4}&k5={v5}";
export type Variables<S extends string>=S extends `${string}{${infer K}}${infer Rest}`?{[P in K|keyof Variables<Rest>]:string}:{};
export type Input=Variables<Template>;
export function solve(values:Input): string {
  return "k1={v1}&k2={v2}&k3={v3}&k4={v4}&k5={v5}".replace(/{([^}]+)}/g,(_,key:string)=>encodeURIComponent(values[key as keyof Input]));
}
