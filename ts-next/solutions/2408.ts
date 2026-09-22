// 2408: Exclusive option-set encodings / exclusive-options=name+active
// never forbidden properties; XOR-shaped unions
export type Options={name:string;count?:never;active?:never;tags?:never}|{name?:never;count?:never;active:boolean;tags?:never};
export function solve(options:Options): string {
  const keys=["name","active"];const present=keys.filter(key=>Object.hasOwn(options,key));if(present.length!==1)throw new Error('Choose exactly one');const key=present[0]!;return key+'='+JSON.stringify(Reflect.get(options,key));
}
