// 2194: Budgeted kebab-to-camel literal transforms / hyphen-conversions=1
// Capitalize intrinsic; recursive infer composition
export type Camel<S extends string,C extends unknown[]=[]>=C['length'] extends 1?S:S extends `${infer H}-${infer R}`?R extends `${infer First}${infer Tail}`?`${H}${Uppercase<First>}${Camel<Tail,[...C,unknown]>}`:H:S;
export function solve<const S extends string>(text:S): Camel<S> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2194');
}
