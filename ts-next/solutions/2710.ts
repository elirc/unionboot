// 2710: Typed coefficient polynomial evaluation / polynomial-degree=7
// const tuple coefficient degree; exact arity contracts
export type Coefficients=readonly [number, number, number, number, number, number, number, number];
export type Evaluation={readonly degree:7;readonly value:number};
export function solve(coefficients:Coefficients,x:number): Evaluation {
  let value=0;for(const coefficient of coefficients)value=value*x+coefficient;return {degree:7,value};
}
