// 2152: Budgeted delimited literal parsing / maximum-splits=4
// template-literal split inference; trailing empty positions
export type Split<S extends string,A extends string[]=[]>=A['length'] extends 4?readonly [...A,S]:S extends `${infer H}|${infer R}`?Split<R,[...A,H]>:readonly [...A,S];
export function solve<const S extends string>(text:S): Split<S> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2152');
}
