// 2269: Getter-key remapping surfaces / getter-fields=name
// mapped as clauses; Capitalize; lazy callbacks
export type Input={ name: string };
export type Getters<T>={[K in keyof T as K extends string?`get${Capitalize<K>}`:never]:()=>T[K]};
export function solve(input:Input): Getters<Input> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2269');
}
