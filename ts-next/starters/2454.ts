// 2454: Nested promise-container inference / async-container-depth=6
// Awaited within recursive records; promise identity boundaries
export type Input={next:{next:{next:{next:{next:{next:Promise<number>}}}}}};
export type Resolved<T>=T extends PromiseLike<infer U>?Awaited<U>:T extends {next:infer N}?{next:Resolved<N>}:T;
export function solve(input:Input): Promise<Resolved<Input>> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2454');
}
