// 2113: Tuple insertion boundary inference / insert-index=10
// tuple rest decomposition; insertion position algebra
export type Insert<T extends readonly unknown[],V,A extends unknown[]=[]>=A['length'] extends 10?readonly [...A,V,...T]:T extends readonly [infer H,...infer R]?Insert<R,V,[...A,H]>:readonly [...A,V];
export function solve<const T extends readonly unknown[],const V>(input:T & (number extends T['length']?never:unknown),value:V): Insert<T,V> {
  const index=Math.min(10,input.length);/* The clamped index partitions T; concatenate its prefix, one V, and its unchanged suffix as Insert<T,V>. */ return [...input.slice(0,index),value,...input.slice(index)] as unknown as Insert<T,V>;
}
