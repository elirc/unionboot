// 2303: Null-omitting optional property contracts / omittable-fields=name+active
// optional mapped modifiers; null exclusion; own-key omission
export type Input={name:string|null;active:boolean|null};
export type Present<T>={[K in keyof T]?:Exclude<T[K],null>};
export function solve(input:Input): Present<Input> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2303');
}
