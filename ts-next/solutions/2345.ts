// 2345: Schema-literal value inference / schema-fields=count
// satisfies contracts; indexed discriminant inference
export type Descriptor={kind:'number'|'string'|'boolean'|'strings'};
export const schema={"count":{"kind":"number"}} as const satisfies Record<string,Descriptor>;
export type Infer<S>={[K in keyof S]:S[K] extends {kind:'number'}?number:S[K] extends {kind:'boolean'}?boolean:S[K] extends {kind:'strings'}?readonly string[]:string};
export type Output=Infer<typeof schema>;
export function solve(input:unknown): Output {
  if(typeof input!=='object'||input===null||Array.isArray(input))throw new Error('Invalid record');const record=input as Record<string,unknown>;if(!Object.hasOwn(record,"count")||typeof record.count!=="number")throw new Error('Invalid count');return {count:record.count} as Output;
}
