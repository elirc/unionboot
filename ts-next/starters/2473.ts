// 2473: Finite protocol transition tables / protocol-steps=10
// state-dependent events; indexed transition return types
export type State="s0"|"s1"|"s2"|"s3"|"s4"|"s5"|"s6"|"s7"|"s8"|"s9"|"s10";
export type Next={s0:"s1";s1:"s2";s2:"s3";s3:"s4";s4:"s5";s5:"s6";s6:"s7";s7:"s8";s8:"s9";s9:"s10"};
export type Live=keyof Next;
export function solve<S extends Live>(state:S,event:"advance"): Next[S] {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2473');
}
