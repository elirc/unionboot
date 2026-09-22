// 2319: Optional-property default materialization / required-default-fields=count+active
// mapped required modifiers; exact absence semantics
export type Input={count?:number;active?:boolean};
export type Output={-readonly [K in keyof Input]-?:Input[K]};
export function solve(input:Input): Output {
  return {...{"count":3,"active":true},...input};
}
