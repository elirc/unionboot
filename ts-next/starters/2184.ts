// 2184: Bounded ASCII whitespace trimming / leading-whitespace-budget=6
// template union matching; asymmetric literal transforms
export type Trim<S extends string,C extends unknown[]=[]>=C['length'] extends 6?S:S extends `${" "|"\n"|"\t"|"\r"}${infer R}`?Trim<R,[...C,unknown]>:S;
export function solve<const S extends string>(text:S): Trim<S> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2184');
}
