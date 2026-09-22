// 2318: Optional-property default materialization / required-default-fields=name+active
// mapped required modifiers; exact absence semantics
export type Input={name?:string;active?:boolean};
export type Output={-readonly [K in keyof Input]-?:Input[K]};
export function solve(input:Input): Output {
  return {...{"name":"Ada","active":true},...input};
}
