// 2142: Positional printf-token inference / format-token-arity=9
// template literal token parser; heterogeneous rest tuples
export type Format="%s | %d | %b | %s | %d | %b | %s | %d | %b";
export type Args<S extends string>=S extends `${string}%${infer C}${infer R}`?C extends 's'? [string,...Args<R>]:C extends 'd'?[number,...Args<R>]:C extends 'b'?[boolean,...Args<R>]:Args<R>:[];
export function solve(...args:Args<Format>): string {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2142');
}
