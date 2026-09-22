// 2326: Optional-property default materialization / required-default-fields=name+active+tags
// mapped required modifiers; exact absence semantics
export type Input={name?:string;active?:boolean;tags?:readonly string[]};
export type Output={-readonly [K in keyof Input]-?:Input[K]};
export function solve(input:Input): Output {
  return {...{"name":"Ada","active":true,"tags":["a","b"]},...input};
}
