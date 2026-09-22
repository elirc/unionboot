// 2581: Capability-composed audit mixins / audit-methods=name+active+tags
// intersection mixins; object augmentation; method capabilities
export type Model={ name: string; active: boolean; tags: readonly string[] };
export type Audited<T>=T&{auditName:()=>string;auditActive:()=>string;auditTags:()=>string};
export function solve<T extends Model>(input:T): Audited<T> {
  return Object.assign({},input,{auditName:()=>"name="+JSON.stringify(input.name),auditActive:()=>"active="+JSON.stringify(input.active),auditTags:()=>"tags="+JSON.stringify(input.tags)});
}
