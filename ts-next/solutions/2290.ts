// 2290: Setter-key remapping surfaces / setter-fields=name+count+active
// mapped as clauses; callback parameter correlation
export type Input={ name: string; count: number; active: boolean };
export type Setters<T>={[K in keyof T as K extends string?`set${Capitalize<K>}`:never]:(value:T[K])=>void};
export function solve(input:Input): Setters<Input> {
  const out:Record<string,(value:unknown)=>void>={};for(const key of Object.keys(input) as (keyof Input)[]){out['set'+key[0]!.toUpperCase()+key.slice(1)]=(value:unknown)=>{Reflect.set(input,key,value);};}return out as Setters<Input>;
}
