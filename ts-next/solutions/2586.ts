// 2586: Arity-directed overload selection / overload-tuple-width=3
// overload sets; conditional input-return relationships
export type Batch=readonly [number, number, number];
export type API={ (value:number):string;(value:Batch):readonly [string, string, string];};
export function solve(): API {
  const run=(value:number|Batch):string|readonly string[]=>typeof value==='number'?String(value):value.map(String);return run as API;
}
