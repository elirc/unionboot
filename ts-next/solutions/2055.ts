// 2055: Literal tuple replication / copies=12
// const inference; fixed-size tuple construction
export type Copies<T,A extends T[]=[]>=A['length'] extends 12?readonly [...A]:Copies<T,[...A,T]>;
export function solve<const T>(value:T): Copies<T> {
  /* Array.from invokes the callback exactly 12 times, placing the identical T reference in every position. */ return Array.from({length:12},()=>value) as unknown as Copies<T>;
}
