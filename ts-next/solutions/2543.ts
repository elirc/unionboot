// 2543: Explicit-this record methods / this-receiver-fields=name+active
// this parameters; call binding; receiver constraints
export type Receiver={ name: string; active: boolean };
export type Method=(this:Receiver,prefix:string)=>string;
export function solve(): Method {
  return function(this:Receiver,prefix:string):string{return prefix+["name","active"].map(key=>String(Reflect.get(this,key))).join('|');};
}
