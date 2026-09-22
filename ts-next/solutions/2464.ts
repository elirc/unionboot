// 2464: Finite protocol transition tables / protocol-steps=1
// state-dependent events; indexed transition return types
export type State="s0"|"s1";
export type Next={s0:"s1"};
export type Live=keyof Next;
export function solve<S extends Live>(state:S,event:"advance"): Next[S] {
  if(event!=='advance')throw new Error('Invalid event');const table:Next={"s0":"s1"};if(!Object.hasOwn(table,state))throw new Error('Terminal state');return table[state];
}
