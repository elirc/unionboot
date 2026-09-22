// 2549: Explicit-this record methods / this-receiver-fields=name+count+tags
// this parameters; call binding; receiver constraints
export type Receiver={ name: string; count: number; tags: readonly string[] };
export type Method=(this:Receiver,prefix:string)=>string;
export function solve(): Method {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2549');
}
