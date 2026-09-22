// 2063: Overlapping tuple window types / window-width=5
// recursive tuple windows; saturated boundaries
type Prefix<T extends readonly unknown[],A extends unknown[]=[]>=A['length'] extends 5?readonly [...A]:T extends readonly [infer H,...infer R]?Prefix<R,[...A,H]>:never;
export type Windows<T extends readonly unknown[]> = T extends readonly [unknown,...infer Rest] ? [Prefix<T>] extends [never] ? readonly [] : readonly [Prefix<T>,...Windows<Rest>] : readonly [];
export function solve<const T extends readonly unknown[]>(input:T & (number extends T['length']?never:unknown)): Windows<T> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2063');
}
