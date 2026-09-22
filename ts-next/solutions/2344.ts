// 2344: Schema-literal value inference / schema-fields=name
// satisfies contracts; indexed discriminant inference
export type Descriptor={kind:'number'|'string'|'boolean'|'strings'};
export const schema={"name":{"kind":"string"}} as const satisfies Record<string,Descriptor>;
export type Infer<S>={[K in keyof S]:S[K] extends {kind:'number'}?number:S[K] extends {kind:'boolean'}?boolean:S[K] extends {kind:'strings'}?readonly string[]:string};
export type Output=Infer<typeof schema>;
export function solve(input:unknown): Output {
  if(typeof input!=='object'||input===null||Array.isArray(input))throw new Error('Invalid record');const record=input as Record<string,unknown>;if(!Object.hasOwn(record,"name")||typeof record.name!=="string")throw new Error('Invalid name');return {name:record.name} as Output;
}
