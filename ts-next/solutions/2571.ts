// 2571: Capability-composed audit mixins / audit-methods=name+count
// intersection mixins; object augmentation; method capabilities
export type Model={ name: string; count: number };
export type Audited<T>=T&{auditName:()=>string;auditCount:()=>string};
export function solve<T extends Model>(input:T): Audited<T> {
  return Object.assign({},input,{auditName:()=>"name="+JSON.stringify(input.name),auditCount:()=>"count="+JSON.stringify(input.count)});
}
