// 2320: Optional-property default materialization / required-default-fields=name+count+active
// mapped required modifiers; exact absence semantics
export type Input={name?:string;count?:number;active?:boolean};
export type Output={-readonly [K in keyof Input]-?:Input[K]};
export function solve(input:Input): Output {
  return {...{"name":"Ada","count":3,"active":true},...input};
}
