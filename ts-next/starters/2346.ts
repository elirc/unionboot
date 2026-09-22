// 2346: Schema-literal value inference / schema-fields=name+count
// satisfies contracts; indexed discriminant inference
export type Descriptor={kind:'number'|'string'|'boolean'|'strings'};
export const schema={"name":{"kind":"string"},"count":{"kind":"number"}} as const satisfies Record<string,Descriptor>;
export type Infer<S>={[K in keyof S]:S[K] extends {kind:'number'}?number:S[K] extends {kind:'boolean'}?boolean:S[K] extends {kind:'strings'}?readonly string[]:string};
export type Output=Infer<typeof schema>;
export function solve(input:unknown): Output {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2346');
}
