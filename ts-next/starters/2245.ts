// 2245: Fixed-width binary-word decoding / binary-width=7
// recursive template validation; intersection input constraints
export type Valid<S extends string,C extends unknown[]=[]>=S extends `${infer H}${infer R}`?H extends '0'|'1'?Valid<R,[...C,unknown]>:false:C['length'] extends 7?true:false;
export function solve<const S extends string>(word:S & (Valid<S> extends true?unknown:never)): number {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2245');
}
