// 2170: Bounded leading-slash normalization / slash-budget=7
// recursive template consumption; normalization budgets
export type Strip<S extends string,C extends unknown[]=[]>=C['length'] extends 7?S:S extends `/${infer R}`?Strip<R,[...C,unknown]>:S;
export function solve<const S extends string>(text:S): Strip<S> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2170');
}
