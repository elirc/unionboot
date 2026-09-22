// 2052: Literal tuple replication / copies=9
// const inference; fixed-size tuple construction
export type Copies<T,A extends T[]=[]>=A['length'] extends 9?readonly [...A]:Copies<T,[...A,T]>;
export function solve<const T>(value:T): Copies<T> {
  /* Array.from invokes the callback exactly 9 times, placing the identical T reference in every position. */ return Array.from({length:9},()=>value) as unknown as Copies<T>;
}
