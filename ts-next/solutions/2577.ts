// 2577: Capability-composed audit mixins / audit-methods=name+tags
// intersection mixins; object augmentation; method capabilities
export type Model={ name: string; tags: readonly string[] };
export type Audited<T>=T&{auditName:()=>string;auditTags:()=>string};
export function solve<T extends Model>(input:T): Audited<T> {
  return Object.assign({},input,{auditName:()=>"name="+JSON.stringify(input.name),auditTags:()=>"tags="+JSON.stringify(input.tags)});
}
