// 2075: Position-labelled tuple enumeration / input-arity=2
// mapped tuple indexes; numeric template inference
export type Input = readonly [number, number];
type Numeric<S>=string extends S?never:S extends `${infer N extends number}`?N:never;
export type Output = readonly [{readonly index:0;readonly value:number}, {readonly index:1;readonly value:number}];
export function solve(input: Input): Output {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2075');
}
