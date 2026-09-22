// 2288: Setter-key remapping surfaces / setter-fields=name+active
// mapped as clauses; callback parameter correlation
export type Input={ name: string; active: boolean };
export type Setters<T>={[K in keyof T as K extends string?`set${Capitalize<K>}`:never]:(value:T[K])=>void};
export function solve(input:Input): Setters<Input> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2288');
}
