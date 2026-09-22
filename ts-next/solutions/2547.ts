// 2547: Explicit-this record methods / this-receiver-fields=name+tags
// this parameters; call binding; receiver constraints
export type Receiver={ name: string; tags: readonly string[] };
export type Method=(this:Receiver,prefix:string)=>string;
export function solve(): Method {
  return function(this:Receiver,prefix:string):string{return prefix+["name","tags"].map(key=>String(Reflect.get(this,key))).join('|');};
}
