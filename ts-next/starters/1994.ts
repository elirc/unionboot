// 1994: Saturating tuple prefix algebra / take=11
// tuple infer; bounded take; literal length
export type Take<T extends readonly unknown[], A extends unknown[]=[]>=A['length'] extends 11?readonly [...A]:T extends readonly [infer H,...infer R]?Take<R,[...A,H]>:readonly [...A];
export function solve<const T extends readonly unknown[]>(input:T & (number extends T['length']?never:unknown)): Take<T> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 1994');
}
