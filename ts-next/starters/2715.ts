// 2715: Typed coefficient polynomial evaluation / polynomial-degree=12
// const tuple coefficient degree; exact arity contracts
export type Coefficients=readonly [number, number, number, number, number, number, number, number, number, number, number, number, number];
export type Evaluation={readonly degree:12;readonly value:number};
export function solve(coefficients:Coefficients,x:number): Evaluation {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2715');
}
