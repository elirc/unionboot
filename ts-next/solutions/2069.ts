// 2069: Overlapping tuple window types / window-width=11
// recursive tuple windows; saturated boundaries
type Prefix<T extends readonly unknown[],A extends unknown[]=[]>=A['length'] extends 11?readonly [...A]:T extends readonly [infer H,...infer R]?Prefix<R,[...A,H]>:never;
export type Windows<T extends readonly unknown[]> = T extends readonly [unknown,...infer Rest] ? [Prefix<T>] extends [never] ? readonly [] : readonly [Prefix<T>,...Windows<Rest>] : readonly [];
export function solve<const T extends readonly unknown[]>(input:T & (number extends T['length']?never:unknown)): Windows<T> {
  const out:unknown[][]=[];for(let i=0;i+11<=input.length;i++)out.push(input.slice(i,i+11));return out as unknown as Windows<T>;
}
