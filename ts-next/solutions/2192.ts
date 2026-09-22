// 2192: Bounded ASCII whitespace trimming / leading-whitespace-budget=14
// template union matching; asymmetric literal transforms
export type Trim<S extends string,C extends unknown[]=[]>=C['length'] extends 14?S:S extends `${" "|"\n"|"\t"|"\r"}${infer R}`?Trim<R,[...C,unknown]>:S;
export function solve<const S extends string>(text:S): Trim<S> {
  let out:string=text;for(let i=0;i<14&&/^[ \t\r\n]/.test(out);i++)out=out.slice(1);return out as Trim<S>;
}
