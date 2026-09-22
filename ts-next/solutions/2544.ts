// 2544: Explicit-this record methods / this-receiver-fields=count+active
// this parameters; call binding; receiver constraints
export type Receiver={ count: number; active: boolean };
export type Method=(this:Receiver,prefix:string)=>string;
export function solve(): Method {
  return function(this:Receiver,prefix:string):string{return prefix+["count","active"].map(key=>String(Reflect.get(this,key))).join('|');};
}
