// 2276: Getter-key remapping surfaces / getter-fields=tags
// mapped as clauses; Capitalize; lazy callbacks
export type Input={ tags: readonly string[] };
export type Getters<T>={[K in keyof T as K extends string?`get${Capitalize<K>}`:never]:()=>T[K]};
export function solve(input:Input): Getters<Input> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2276');
}
