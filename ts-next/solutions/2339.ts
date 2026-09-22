// 2339: Key-value entry union serialization / entry-union-fields=name+count+tags
// indexed mapped unions; entry tuple correlations
export type Input={ name: string; count: number; tags: readonly string[] };
export type Entry<T>={[K in keyof T]-?:readonly [K,T[K]]}[keyof T];
export function solve(input:Input): readonly Entry<Input>[] {
  return Object.entries(input) as Entry<Input>[];
}
