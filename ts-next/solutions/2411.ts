// 2411: Exclusive option-set encodings / exclusive-options=tags
// never forbidden properties; XOR-shaped unions
export type Options={name?:never;count?:never;active?:never;tags:readonly string[]};
export function solve(options:Options): string {
  const keys=["tags"];const present=keys.filter(key=>Object.hasOwn(options,key));if(present.length!==1)throw new Error('Choose exactly one');const key=present[0]!;return key+'='+JSON.stringify(Reflect.get(options,key));
}
