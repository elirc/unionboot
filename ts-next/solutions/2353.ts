// 2353: Schema-literal value inference / schema-fields=count+tags
// satisfies contracts; indexed discriminant inference
export type Descriptor={kind:'number'|'string'|'boolean'|'strings'};
export const schema={"count":{"kind":"number"},"tags":{"kind":"strings"}} as const satisfies Record<string,Descriptor>;
export type Infer<S>={[K in keyof S]:S[K] extends {kind:'number'}?number:S[K] extends {kind:'boolean'}?boolean:S[K] extends {kind:'strings'}?readonly string[]:string};
export type Output=Infer<typeof schema>;
export function solve(input:unknown): Output {
  if(typeof input!=='object'||input===null||Array.isArray(input))throw new Error('Invalid record');const record=input as Record<string,unknown>;if(!Object.hasOwn(record,"count")||typeof record.count!=="number")throw new Error('Invalid count');if(!Object.hasOwn(record,"tags")||!Array.isArray(record.tags)||!Array.from(record.tags as unknown[]).every(x=>typeof x==='string'))throw new Error('Invalid tags');return {count:record.count,tags:record.tags} as Output;
}
