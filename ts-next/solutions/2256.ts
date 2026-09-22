// 2256: Balanced literal envelope construction / bracket-depth=3
// recursive template wrapping; branded-free literal proofs
export type Envelope<S extends string,C extends unknown[]=[]>=C['length'] extends 3?S:Envelope<`[${S}]`,[...C,unknown]>;
export function solve<const S extends string>(text:S): Envelope<S> {
  return ('['.repeat(3)+text+']'.repeat(3)) as Envelope<S>;
}
