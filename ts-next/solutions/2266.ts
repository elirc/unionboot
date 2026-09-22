// 2266: Balanced literal envelope construction / bracket-depth=13
// recursive template wrapping; branded-free literal proofs
export type Envelope<S extends string,C extends unknown[]=[]>=C['length'] extends 13?S:Envelope<`[${S}]`,[...C,unknown]>;
export function solve<const S extends string>(text:S): Envelope<S> {
  return ('['.repeat(13)+text+']'.repeat(13)) as Envelope<S>;
}
