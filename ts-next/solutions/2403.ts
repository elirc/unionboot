// 2403: Readonly-key release maps / released-readonly-fields=name+count+active+tags
// minus-readonly modifiers; selected mutable capability
export type Input={ readonly name: string; readonly count: number; readonly active: boolean; readonly tags: readonly string[] };
export type Released="name"|"count"|"active"|"tags";
export type Output=Omit<Input,Released>&{-readonly [K in Released]:Input[K]};
export function solve(input:Input): Output {
  return {...input};
}
