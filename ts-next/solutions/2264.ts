// 2264: Balanced literal envelope construction / bracket-depth=11
// recursive template wrapping; branded-free literal proofs
export type Envelope<S extends string,C extends unknown[]=[]>=C['length'] extends 11?S:Envelope<`[${S}]`,[...C,unknown]>;
export function solve<const S extends string>(text:S): Envelope<S> {
  return ('['.repeat(11)+text+']'.repeat(11)) as Envelope<S>;
}
