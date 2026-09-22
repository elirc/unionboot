// 2254: Balanced literal envelope construction / bracket-depth=1
// recursive template wrapping; branded-free literal proofs
export type Envelope<S extends string,C extends unknown[]=[]>=C['length'] extends 1?S:Envelope<`[${S}]`,[...C,unknown]>;
export function solve<const S extends string>(text:S): Envelope<S> {
  return ('['.repeat(1)+text+']'.repeat(1)) as Envelope<S>;
}
