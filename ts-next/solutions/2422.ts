// 2422: Depth-limited readonly graph copies / readonly-depth=4
// recursive mapped readonly; bounded ownership
export type Deep<T,C extends unknown[]=[]>=C['length'] extends 4?T:T extends object?{readonly [K in keyof T]:Deep<T[K],[...C,unknown]>}:T;
export function solve<T>(input:T): Deep<T> {
  function visit(value:unknown,depth:number):unknown{if(depth===4||value===null||typeof value!=='object')return value;const out:Record<string,unknown>|unknown[]=Array.isArray(value)?[]:{};for(const key of Object.keys(value))Object.defineProperty(out,key,{value:visit(Reflect.get(value,key),depth+1),enumerable:true});return Object.freeze(out);}return visit(input,0) as Deep<T>;
}
