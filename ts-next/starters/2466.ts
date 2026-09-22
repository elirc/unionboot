// 2466: Finite protocol transition tables / protocol-steps=3
// state-dependent events; indexed transition return types
export type State="s0"|"s1"|"s2"|"s3";
export type Next={s0:"s1";s1:"s2";s2:"s3"};
export type Live=keyof Next;
export function solve<S extends Live>(state:S,event:"advance"): Next[S] {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2466');
}
