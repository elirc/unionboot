// 2106: Tuple insertion boundary inference / insert-index=3
// tuple rest decomposition; insertion position algebra
export type Insert<T extends readonly unknown[],V,A extends unknown[]=[]>=A['length'] extends 3?readonly [...A,V,...T]:T extends readonly [infer H,...infer R]?Insert<R,V,[...A,H]>:readonly [...A,V];
export function solve<const T extends readonly unknown[],const V>(input:T & (number extends T['length']?never:unknown),value:V): Insert<T,V> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2106');
}
