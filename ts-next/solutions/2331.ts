// 2331: Key-value entry union serialization / entry-union-fields=name+count
// indexed mapped unions; entry tuple correlations
export type Input={ name: string; count: number };
export type Entry<T>={[K in keyof T]-?:readonly [K,T[K]]}[keyof T];
export function solve(input:Input): readonly Entry<Input>[] {
  return Object.entries(input) as Entry<Input>[];
}
