// 2442: Depth-limited patch materialization / patch-depth=9
// recursive Partial; exact optional boundaries
export type Model={next:{next:{next:{next:{next:{next:{next:{next:{next:{leaf:number}}}}}}}}}};
export type Patch<T,C extends unknown[]=[]>=C['length'] extends 9?T:T extends object?{[K in keyof T]?:Patch<T[K],[...C,unknown]>}:T;
export function solve(patch:Patch<Model>): Model {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2442');
}
