// 2208: Budgeted kebab-to-camel literal transforms / hyphen-conversions=15
// Capitalize intrinsic; recursive infer composition
export type Camel<S extends string,C extends unknown[]=[]>=C['length'] extends 15?S:S extends `${infer H}-${infer R}`?R extends `${infer First}${infer Tail}`?`${H}${Uppercase<First>}${Camel<Tail,[...C,unknown]>}`:H:S;
export function solve<const S extends string>(text:S): Camel<S> {
  let out='',rest:string=text;for(let i=0;i<15;i++){const at=rest.indexOf('-');if(at<0)break;out+=rest.slice(0,at);rest=rest.slice(at+1);if(rest.length){out+=rest[0]!.toUpperCase();rest=rest.slice(1);}}return (out+rest) as Camel<S>;
}
