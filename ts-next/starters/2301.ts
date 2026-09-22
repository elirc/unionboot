// 2301: Null-omitting optional property contracts / omittable-fields=name+count
// optional mapped modifiers; null exclusion; own-key omission
export type Input={name:string|null;count:number|null};
export type Present<T>={[K in keyof T]?:Exclude<T[K],null>};
export function solve(input:Input): Present<Input> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2301');
}
