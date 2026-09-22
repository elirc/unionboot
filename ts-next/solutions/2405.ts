// 2405: Exclusive option-set encodings / exclusive-options=count
// never forbidden properties; XOR-shaped unions
export type Options={name?:never;count:number;active?:never;tags?:never};
export function solve(options:Options): string {
  const keys=["count"];const present=keys.filter(key=>Object.hasOwn(options,key));if(present.length!==1)throw new Error('Choose exactly one');const key=present[0]!;return key+'='+JSON.stringify(Reflect.get(options,key));
}
