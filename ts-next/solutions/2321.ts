// 2321: Optional-property default materialization / required-default-fields=tags
// mapped required modifiers; exact absence semantics
export type Input={tags?:readonly string[]};
export type Output={-readonly [K in keyof Input]-?:Input[K]};
export function solve(input:Input): Output {
  return {...{"tags":["a","b"]},...input};
}
