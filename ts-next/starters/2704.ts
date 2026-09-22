// 2704: Typed coefficient polynomial evaluation / polynomial-degree=1
// const tuple coefficient degree; exact arity contracts
export type Coefficients=readonly [number, number];
export type Evaluation={readonly degree:1;readonly value:number};
export function solve(coefficients:Coefficients,x:number): Evaluation {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2704');
}
