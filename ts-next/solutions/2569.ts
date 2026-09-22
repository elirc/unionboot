// 2569: Capability-composed audit mixins / audit-methods=name
// intersection mixins; object augmentation; method capabilities
export type Model={ name: string };
export type Audited<T>=T&{auditName:()=>string};
export function solve<T extends Model>(input:T): Audited<T> {
  return Object.assign({},input,{auditName:()=>"name="+JSON.stringify(input.name)});
}
