// 2332: Key-value entry union serialization / entry-union-fields=active
// indexed mapped unions; entry tuple correlations
export type Input={ active: boolean };
export type Entry<T>={[K in keyof T]-?:readonly [K,T[K]]}[keyof T];
export function solve(input:Input): readonly Entry<Input>[] {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2332');
}
