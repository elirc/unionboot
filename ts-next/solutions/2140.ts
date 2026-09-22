// 2140: Positional printf-token inference / format-token-arity=7
// template literal token parser; heterogeneous rest tuples
export type Format="%s | %d | %b | %s | %d | %b | %s";
export type Args<S extends string>=S extends `${string}%${infer C}${infer R}`?C extends 's'? [string,...Args<R>]:C extends 'd'?[number,...Args<R>]:C extends 'b'?[boolean,...Args<R>]:Args<R>:[];
export function solve(...args:Args<Format>): string {
  let index=0;return "%s | %d | %b | %s | %d | %b | %s".replace(/%[sdb]/g,()=>String(args[index++]));
}
