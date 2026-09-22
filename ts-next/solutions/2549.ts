// 2549: Explicit-this record methods / this-receiver-fields=name+count+tags
// this parameters; call binding; receiver constraints
export type Receiver={ name: string; count: number; tags: readonly string[] };
export type Method=(this:Receiver,prefix:string)=>string;
export function solve(): Method {
  return function(this:Receiver,prefix:string):string{return prefix+["name","count","tags"].map(key=>String(Reflect.get(this,key))).join('|');};
}
