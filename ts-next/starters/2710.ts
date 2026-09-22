// 2710: Typed coefficient polynomial evaluation / polynomial-degree=7
// const tuple coefficient degree; exact arity contracts
export type Coefficients=readonly [number, number, number, number, number, number, number, number];
export type Evaluation={readonly degree:7;readonly value:number};
export function solve(coefficients:Coefficients,x:number): Evaluation {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2710');
}
