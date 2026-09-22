// 2550: Explicit-this record methods / this-receiver-fields=active+tags
// this parameters; call binding; receiver constraints
export type Receiver={ active: boolean; tags: readonly string[] };
export type Method=(this:Receiver,prefix:string)=>string;
export function solve(): Method {
  return function(this:Receiver,prefix:string):string{return prefix+["active","tags"].map(key=>String(Reflect.get(this,key))).join('|');};
}
