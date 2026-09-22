// 2315: Optional-property default materialization / required-default-fields=count
// mapped required modifiers; exact absence semantics
export type Input={count?:number};
export type Output={-readonly [K in keyof Input]-?:Input[K]};
export function solve(input:Input): Output {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2315');
}
