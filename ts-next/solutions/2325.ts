// 2325: Optional-property default materialization / required-default-fields=active+tags
// mapped required modifiers; exact absence semantics
export type Input={active?:boolean;tags?:readonly string[]};
export type Output={-readonly [K in keyof Input]-?:Input[K]};
export function solve(input:Input): Output {
  return {...{"active":true,"tags":["a","b"]},...input};
}
