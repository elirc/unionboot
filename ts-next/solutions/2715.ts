// 2715: Typed coefficient polynomial evaluation / polynomial-degree=12
// const tuple coefficient degree; exact arity contracts
export type Coefficients=readonly [number, number, number, number, number, number, number, number, number, number, number, number, number];
export type Evaluation={readonly degree:12;readonly value:number};
export function solve(coefficients:Coefficients,x:number): Evaluation {
  let value=0;for(const coefficient of coefficients)value=value*x+coefficient;return {degree:12,value};
}
