// 2317: Optional-property default materialization / required-default-fields=active
// mapped required modifiers; exact absence semantics
export type Input={active?:boolean};
export type Output={-readonly [K in keyof Input]-?:Input[K]};
export function solve(input:Input): Output {
  return {...{"active":true},...input};
}
