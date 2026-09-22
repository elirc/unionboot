// 2010: Saturating tuple suffix algebra / drop=12
// variadic rest inference; bounded drop
export type Drop<T extends readonly unknown[], A extends unknown[]=[]>=A['length'] extends 12?readonly [...T]:T extends readonly [unknown,...infer R]?Drop<R,[...A,unknown]>:readonly [];
export function solve<const T extends readonly unknown[]>(input:T & (number extends T['length']?never:unknown)): Drop<T> {
  return input.slice(12) as unknown as Drop<T>;
}
