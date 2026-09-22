// 2541: Explicit-this record methods / this-receiver-fields=name+count
// this parameters; call binding; receiver constraints
export type Receiver={ name: string; count: number };
export type Method=(this:Receiver,prefix:string)=>string;
export function solve(): Method {
  return function(this:Receiver,prefix:string):string{return prefix+["name","count"].map(key=>String(Reflect.get(this,key))).join('|');};
}
