// 2356: Schema-literal value inference / schema-fields=name+active+tags
// satisfies contracts; indexed discriminant inference
export type Descriptor={kind:'number'|'string'|'boolean'|'strings'};
export const schema={"name":{"kind":"string"},"active":{"kind":"boolean"},"tags":{"kind":"strings"}} as const satisfies Record<string,Descriptor>;
export type Infer<S>={[K in keyof S]:S[K] extends {kind:'number'}?number:S[K] extends {kind:'boolean'}?boolean:S[K] extends {kind:'strings'}?readonly string[]:string};
export type Output=Infer<typeof schema>;
export function solve(input:unknown): Output {
  if(typeof input!=='object'||input===null||Array.isArray(input))throw new Error('Invalid record');const record=input as Record<string,unknown>;if(!Object.hasOwn(record,"name")||typeof record.name!=="string")throw new Error('Invalid name');if(!Object.hasOwn(record,"active")||typeof record.active!=="boolean")throw new Error('Invalid active');if(!Object.hasOwn(record,"tags")||!Array.isArray(record.tags)||!Array.from(record.tags as unknown[]).every(x=>typeof x==='string'))throw new Error('Invalid tags');return {name:record.name,active:record.active,tags:record.tags} as Output;
}
