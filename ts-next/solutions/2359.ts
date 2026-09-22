// 2359: Phantom capability authorization plans / required-capabilities=name
// phantom records; structural capabilities; input authority
declare const permit:unique symbol;
export type Permit<K extends string>={readonly [permit]:K;readonly capabilities:{readonly [P in K]:true}};
export type Needed="name";
export type Plan={readonly allowed:readonly Needed[]};
export function solve(authority:Permit<Needed>): Plan {
  const needed:Needed[]=["name"];for(const key of needed)if(authority.capabilities[key]!==true)throw new Error('Missing capability');return {allowed:needed};
}
