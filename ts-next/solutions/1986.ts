// 1986: Saturating tuple prefix algebra / take=3
// tuple infer; bounded take; literal length
export type Take<T extends readonly unknown[], A extends unknown[]=[]>=A['length'] extends 3?readonly [...A]:T extends readonly [infer H,...infer R]?Take<R,[...A,H]>:readonly [...A];
export function solve<const T extends readonly unknown[]>(input:T & (number extends T['length']?never:unknown)): Take<T> {
  return input.slice(0,3) as unknown as Take<T>;
}
