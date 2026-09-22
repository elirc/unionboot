// 2580: Capability-composed audit mixins / audit-methods=active+tags
// intersection mixins; object augmentation; method capabilities
export type Model={ active: boolean; tags: readonly string[] };
export type Audited<T>=T&{auditActive:()=>string;auditTags:()=>string};
export function solve<T extends Model>(input:T): Audited<T> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2580');
}
