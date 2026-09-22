// 2544: Explicit-this record methods / this-receiver-fields=count+active
// this parameters; call binding; receiver constraints
export type Receiver={ count: number; active: boolean };
export type Method=(this:Receiver,prefix:string)=>string;
export function solve(): Method {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2544');
}
