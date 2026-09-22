// 2312: Null-omitting optional property contracts / omittable-fields=count+active+tags
// optional mapped modifiers; null exclusion; own-key omission
export type Input={count:number|null;active:boolean|null;tags:readonly string[]|null};
export type Present<T>={[K in keyof T]?:Exclude<T[K],null>};
export function solve(input:Input): Present<Input> {
  const out:Record<string,unknown>={};for(const [key,value] of Object.entries(input))if(value!==null)Object.defineProperty(out,key,{value,enumerable:true,writable:true,configurable:true});return out as Present<Input>;
}
