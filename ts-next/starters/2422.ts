// 2422: Depth-limited readonly graph copies / readonly-depth=4
// recursive mapped readonly; bounded ownership
export type Deep<T,C extends unknown[]=[]>=C['length'] extends 4?T:T extends object?{readonly [K in keyof T]:Deep<T[K],[...C,unknown]>}:T;
export function solve<T>(input:T): Deep<T> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2422');
}
