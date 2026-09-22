// 2540: Explicit-this record methods / this-receiver-fields=count
// this parameters; call binding; receiver constraints
export type Receiver={ count: number };
export type Method=(this:Receiver,prefix:string)=>string;
export function solve(): Method {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2540');
}
