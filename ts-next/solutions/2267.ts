// 2267: Balanced literal envelope construction / bracket-depth=14
// recursive template wrapping; branded-free literal proofs
export type Envelope<S extends string,C extends unknown[]=[]>=C['length'] extends 14?S:Envelope<`[${S}]`,[...C,unknown]>;
export function solve<const S extends string>(text:S): Envelope<S> {
  return ('['.repeat(14)+text+']'.repeat(14)) as Envelope<S>;
}
