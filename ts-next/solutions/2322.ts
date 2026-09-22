// 2322: Optional-property default materialization / required-default-fields=name+tags
// mapped required modifiers; exact absence semantics
export type Input={name?:string;tags?:readonly string[]};
export type Output={-readonly [K in keyof Input]-?:Input[K]};
export function solve(input:Input): Output {
  return {...{"name":"Ada","tags":["a","b"]},...input};
}
