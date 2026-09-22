// 2576: Capability-composed audit mixins / audit-methods=tags
// intersection mixins; object augmentation; method capabilities
export type Model={ tags: readonly string[] };
export type Audited<T>=T&{auditTags:()=>string};
export function solve<T extends Model>(input:T): Audited<T> {
  return Object.assign({},input,{auditTags:()=>"tags="+JSON.stringify(input.tags)});
}
