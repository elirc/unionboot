// 2257: Balanced literal envelope construction / bracket-depth=4
// recursive template wrapping; branded-free literal proofs
export type Envelope<S extends string,C extends unknown[]=[]>=C['length'] extends 4?S:Envelope<`[${S}]`,[...C,unknown]>;
export function solve<const S extends string>(text:S): Envelope<S> {
  return ('['.repeat(4)+text+']'.repeat(4)) as Envelope<S>;
}
