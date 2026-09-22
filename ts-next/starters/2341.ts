// 2341: Key-value entry union serialization / entry-union-fields=name+active+tags
// indexed mapped unions; entry tuple correlations
export type Input={ name: string; active: boolean; tags: readonly string[] };
export type Entry<T>={[K in keyof T]-?:readonly [K,T[K]]}[keyof T];
export function solve(input:Input): readonly Entry<Input>[] {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2341');
}
