// 2011: Saturating tuple suffix algebra / drop=13
// variadic rest inference; bounded drop
export type Drop<T extends readonly unknown[], A extends unknown[]=[]>=A['length'] extends 13?readonly [...T]:T extends readonly [unknown,...infer R]?Drop<R,[...A,unknown]>:readonly [];
export function solve<const T extends readonly unknown[]>(input:T & (number extends T['length']?never:unknown)): Drop<T> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2011');
}
