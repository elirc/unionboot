// 2468: Finite protocol transition tables / protocol-steps=5
// state-dependent events; indexed transition return types
export type State="s0"|"s1"|"s2"|"s3"|"s4"|"s5";
export type Next={s0:"s1";s1:"s2";s2:"s3";s3:"s4";s4:"s5"};
export type Live=keyof Next;
export function solve<S extends Live>(state:S,event:"advance"): Next[S] {
  if(event!=='advance')throw new Error('Invalid event');const table:Next={"s0":"s1","s1":"s2","s2":"s3","s3":"s4","s4":"s5"};if(!Object.hasOwn(table,state))throw new Error('Terminal state');return table[state];
}
