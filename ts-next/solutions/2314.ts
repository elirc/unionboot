// 2314: Optional-property default materialization / required-default-fields=name
// mapped required modifiers; exact absence semantics
export type Input={name?:string};
export type Output={-readonly [K in keyof Input]-?:Input[K]};
export function solve(input:Input): Output {
  return {...{"name":"Ada"},...input};
}
