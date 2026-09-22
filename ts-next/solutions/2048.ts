// 2048: Literal tuple replication / copies=5
// const inference; fixed-size tuple construction
export type Copies<T,A extends T[]=[]>=A['length'] extends 5?readonly [...A]:Copies<T,[...A,T]>;
export function solve<const T>(value:T): Copies<T> {
  /* Array.from invokes the callback exactly 5 times, placing the identical T reference in every position. */ return Array.from({length:5},()=>value) as unknown as Copies<T>;
}
