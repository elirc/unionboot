// 2167: Bounded leading-slash normalization / slash-budget=4
// recursive template consumption; normalization budgets
export type Strip<S extends string,C extends unknown[]=[]>=C['length'] extends 4?S:S extends `/${infer R}`?Strip<R,[...C,unknown]>:S;
export function solve<const S extends string>(text:S): Strip<S> {
  let rest:string=text;for(let i=0;i<4&&rest.startsWith('/');i++)rest=rest.slice(1);return rest as Strip<S>;
}
