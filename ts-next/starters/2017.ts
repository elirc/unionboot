// 2017: Minimum-width tuple padding / minimum-width=4
// recursive tuple construction; padding unions
export type Pad<T extends readonly unknown[],F,A extends unknown[]=[]>=A['length'] extends 4?readonly [...A,...T]:T extends readonly [infer H,...infer R]?Pad<R,F,[...A,H]>:Pad<[],F,[...A,F]>;
export function solve<const T extends readonly unknown[],const F>(input:T & (number extends T['length']?never:unknown),fill:F): Pad<T,F> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2017');
}
