// 2398: Readonly-key release maps / released-readonly-fields=count+tags
// minus-readonly modifiers; selected mutable capability
export type Input={ readonly name: string; readonly count: number; readonly active: boolean; readonly tags: readonly string[] };
export type Released="count"|"tags";
export type Output=Omit<Input,Released>&{-readonly [K in Released]:Input[K]};
export function solve(input:Input): Output {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2398');
}
