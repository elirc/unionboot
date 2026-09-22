// 2244: Fixed-width binary-word decoding / binary-width=6
// recursive template validation; intersection input constraints
export type Valid<S extends string,C extends unknown[]=[]>=S extends `${infer H}${infer R}`?H extends '0'|'1'?Valid<R,[...C,unknown]>:false:C['length'] extends 6?true:false;
export function solve<const S extends string>(word:S & (Valid<S> extends true?unknown:never)): number {
  if(!new RegExp('^[01]{6}$').test(word))throw new Error('Invalid binary word');return Number.parseInt(word,2);
}
