// 2263: Balanced literal envelope construction / bracket-depth=10
// recursive template wrapping; branded-free literal proofs
export type Envelope<S extends string,C extends unknown[]=[]>=C['length'] extends 10?S:Envelope<`[${S}]`,[...C,unknown]>;
export function solve<const S extends string>(text:S): Envelope<S> {
  return ('['.repeat(10)+text+']'.repeat(10)) as Envelope<S>;
}
