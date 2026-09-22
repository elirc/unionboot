// 2031: Tuple left-rotation proofs / rotate-left=3
// tuple concatenation; repeated rotations; exact positions
export type Rotate<T extends readonly unknown[], C extends unknown[]=[]>=C['length'] extends 3?readonly [...T]:T extends readonly [infer H,...infer R]?Rotate<[...R,H],[...C,unknown]>:readonly [];
export function solve<const T extends readonly unknown[]>(input:T & (number extends T['length']?never:unknown)): Rotate<T> {
  if(input.length===0)return [] as unknown as Rotate<T>;const count=3%input.length;/* Moving the prefix after the suffix by n modulo length equals n recursive single-step rotations. */ return [...input.slice(count),...input.slice(0,count)] as unknown as Rotate<T>;
}
