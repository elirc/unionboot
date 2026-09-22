// 2271: Getter-key remapping surfaces / getter-fields=name+count
// mapped as clauses; Capitalize; lazy callbacks
export type Input={ name: string; count: number };
export type Getters<T>={[K in keyof T as K extends string?`get${Capitalize<K>}`:never]:()=>T[K]};
export function solve(input:Input): Getters<Input> {
  const out:Record<string,()=>unknown>={};for(const key of Object.keys(input) as (keyof Input)[])out['get'+key[0]!.toUpperCase()+key.slice(1)]=()=>input[key];return out as Getters<Input>;
}
