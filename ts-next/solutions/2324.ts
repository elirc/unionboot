// 2324: Optional-property default materialization / required-default-fields=name+count+tags
// mapped required modifiers; exact absence semantics
export type Input={name?:string;count?:number;tags?:readonly string[]};
export type Output={-readonly [K in keyof Input]-?:Input[K]};
export function solve(input:Input): Output {
  return {...{"name":"Ada","count":3,"tags":["a","b"]},...input};
}
