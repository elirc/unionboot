// 2570: Capability-composed audit mixins / audit-methods=count
// intersection mixins; object augmentation; method capabilities
export type Model={ count: number };
export type Audited<T>=T&{auditCount:()=>string};
export function solve<T extends Model>(input:T): Audited<T> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2570');
}
