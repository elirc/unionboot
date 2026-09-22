// 2255: Balanced literal envelope construction / bracket-depth=2
// recursive template wrapping; branded-free literal proofs
export type Envelope<S extends string,C extends unknown[]=[]>=C['length'] extends 2?S:Envelope<`[${S}]`,[...C,unknown]>;
export function solve<const S extends string>(text:S): Envelope<S> {
  return ('['.repeat(2)+text+']'.repeat(2)) as Envelope<S>;
}
