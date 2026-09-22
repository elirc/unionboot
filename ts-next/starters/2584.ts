// 2584: Arity-directed overload selection / overload-tuple-width=1
// overload sets; conditional input-return relationships
export type Batch=readonly [number];
export type API={ (value:number):string;(value:Batch):readonly [string];};
export function solve(): API {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2584');
}
