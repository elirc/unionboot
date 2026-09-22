// 2407: Exclusive option-set encodings / exclusive-options=active
// never forbidden properties; XOR-shaped unions
export type Options={name?:never;count?:never;active:boolean;tags?:never};
export function solve(options:Options): string {
  const keys=["active"];const present=keys.filter(key=>Object.hasOwn(options,key));if(present.length!==1)throw new Error('Choose exactly one');const key=present[0]!;return key+'='+JSON.stringify(Reflect.get(options,key));
}
