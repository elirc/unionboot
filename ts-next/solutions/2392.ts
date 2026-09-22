// 2392: Readonly-key release maps / released-readonly-fields=active
// minus-readonly modifiers; selected mutable capability
export type Input={ readonly name: string; readonly count: number; readonly active: boolean; readonly tags: readonly string[] };
export type Released="active";
export type Output=Omit<Input,Released>&{-readonly [K in Released]:Input[K]};
export function solve(input:Input): Output {
  return {...input};
}
