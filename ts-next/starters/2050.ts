// 2050: Literal tuple replication / copies=7
// const inference; fixed-size tuple construction
export type Copies<T,A extends T[]=[]>=A['length'] extends 7?readonly [...A]:Copies<T,[...A,T]>;
export function solve<const T>(value:T): Copies<T> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2050');
}
