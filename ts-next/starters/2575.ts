// 2575: Capability-composed audit mixins / audit-methods=name+count+active
// intersection mixins; object augmentation; method capabilities
export type Model={ name: string; count: number; active: boolean };
export type Audited<T>=T&{auditName:()=>string;auditCount:()=>string;auditActive:()=>string};
export function solve<T extends Model>(input:T): Audited<T> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2575');
}
