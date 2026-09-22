// 2125: Route-template parameter binding / route-parameters=7
// template literal parsing; inferred parameter records
export type Route="/users/:p1/:p2/:p3/:p4/:p5/:p6/:p7";
export type Params<S extends string>=S extends `${string}:${infer K}/${infer R}`?{[P in K|keyof Params<R>]:string}:S extends `${string}:${infer K}`?{[P in K]:string}:{};
export type Input=Params<Route>;
export function solve(params:Input): string {
  const route:Route="/users/:p1/:p2/:p3/:p4/:p5/:p6/:p7";return route.replace(/:([A-Za-z0-9]+)/g,(_,key:string)=>encodeURIComponent(params[key as keyof Input]));
}
