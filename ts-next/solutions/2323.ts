// 2323: Optional-property default materialization / required-default-fields=count+tags
// mapped required modifiers; exact absence semantics
export type Input={count?:number;tags?:readonly string[]};
export type Output={-readonly [K in keyof Input]-?:Input[K]};
export function solve(input:Input): Output {
  return {...{"count":3,"tags":["a","b"]},...input};
}
