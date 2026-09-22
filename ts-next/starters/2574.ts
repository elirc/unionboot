// 2574: Capability-composed audit mixins / audit-methods=count+active
// intersection mixins; object augmentation; method capabilities
export type Model={ count: number; active: boolean };
export type Audited<T>=T&{auditCount:()=>string;auditActive:()=>string};
export function solve<T extends Model>(input:T): Audited<T> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2574');
}
