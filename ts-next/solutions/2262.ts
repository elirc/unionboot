// 2262: Balanced literal envelope construction / bracket-depth=9
// recursive template wrapping; branded-free literal proofs
export type Envelope<S extends string,C extends unknown[]=[]>=C['length'] extends 9?S:Envelope<`[${S}]`,[...C,unknown]>;
export function solve<const S extends string>(text:S): Envelope<S> {
  return ('['.repeat(9)+text+']'.repeat(9)) as Envelope<S>;
}
