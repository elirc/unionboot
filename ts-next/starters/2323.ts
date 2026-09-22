// 2323: Optional-property default materialization / required-default-fields=count+tags
// mapped required modifiers; exact absence semantics
export type Input={count?:number;tags?:readonly string[]};
export type Output={-readonly [K in keyof Input]-?:Input[K]};
export function solve(input:Input): Output {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2323');
}
