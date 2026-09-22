// 2594: Arity-directed overload selection / overload-tuple-width=11
// overload sets; conditional input-return relationships
export type Batch=readonly [number, number, number, number, number, number, number, number, number, number, number];
export type API={ (value:number):string;(value:Batch):readonly [string, string, string, string, string, string, string, string, string, string, string];};
export function solve(): API {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2594');
}
