// 2174: Bounded leading-slash normalization / slash-budget=11
// recursive template consumption; normalization budgets
export type Strip<S extends string,C extends unknown[]=[]>=C['length'] extends 11?S:S extends `/${infer R}`?Strip<R,[...C,unknown]>:S;
export function solve<const S extends string>(text:S): Strip<S> {
  let rest:string=text;for(let i=0;i<11&&rest.startsWith('/');i++)rest=rest.slice(1);return rest as Strip<S>;
}
