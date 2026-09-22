// 2078: Position-labelled tuple enumeration / input-arity=5
// mapped tuple indexes; numeric template inference
export type Input = readonly [number, number, number, number, number];
type Numeric<S>=string extends S?never:S extends `${infer N extends number}`?N:never;
export type Output = readonly [{readonly index:0;readonly value:number}, {readonly index:1;readonly value:number}, {readonly index:2;readonly value:number}, {readonly index:3;readonly value:number}, {readonly index:4;readonly value:number}];
export function solve(input: Input): Output {
  return input.map((value,index)=>({index,value})) as unknown as Output;
}
