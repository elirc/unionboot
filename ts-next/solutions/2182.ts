// 2182: Bounded ASCII whitespace trimming / leading-whitespace-budget=4
// template union matching; asymmetric literal transforms
export type Trim<S extends string,C extends unknown[]=[]>=C['length'] extends 4?S:S extends `${" "|"\n"|"\t"|"\r"}${infer R}`?Trim<R,[...C,unknown]>:S;
export function solve<const S extends string>(text:S): Trim<S> {
  let out:string=text;for(let i=0;i<4&&/^[ \t\r\n]/.test(out);i++)out=out.slice(1);return out as Trim<S>;
}
