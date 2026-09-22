// 2598: Arity-directed overload selection / overload-tuple-width=15
// overload sets; conditional input-return relationships
export type Batch=readonly [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number];
export type API={ (value:number):string;(value:Batch):readonly [string, string, string, string, string, string, string, string, string, string, string, string, string, string, string];};
export function solve(): API {
  const run=(value:number|Batch):string|readonly string[]=>typeof value==='number'?String(value):value.map(String);return run as API;
}
