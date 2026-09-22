// 2040: Tuple left-rotation proofs / rotate-left=12
// tuple concatenation; repeated rotations; exact positions
export type Rotate<T extends readonly unknown[], C extends unknown[]=[]>=C['length'] extends 12?readonly [...T]:T extends readonly [infer H,...infer R]?Rotate<[...R,H],[...C,unknown]>:readonly [];
export function solve<const T extends readonly unknown[]>(input:T & (number extends T['length']?never:unknown)): Rotate<T> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2040');
}
