// 2265: Balanced literal envelope construction / bracket-depth=12
// recursive template wrapping; branded-free literal proofs
export type Envelope<S extends string,C extends unknown[]=[]>=C['length'] extends 12?S:Envelope<`[${S}]`,[...C,unknown]>;
export function solve<const S extends string>(text:S): Envelope<S> {
  return ('['.repeat(12)+text+']'.repeat(12)) as Envelope<S>;
}
