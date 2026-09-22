// 2409: Exclusive option-set encodings / exclusive-options=count+active
// never forbidden properties; XOR-shaped unions
export type Options={name?:never;count:number;active?:never;tags?:never}|{name?:never;count?:never;active:boolean;tags?:never};
export function solve(options:Options): string {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2409');
}
