// 2360: Phantom capability authorization plans / required-capabilities=count
// phantom records; structural capabilities; input authority
declare const permit:unique symbol;
export type Permit<K extends string>={readonly [permit]:K;readonly capabilities:{readonly [P in K]:true}};
export type Needed="count";
export type Plan={readonly allowed:readonly Needed[]};
export function solve(authority:Permit<Needed>): Plan {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2360');
}
