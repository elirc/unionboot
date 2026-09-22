// 2258: Balanced literal envelope construction / bracket-depth=5
// recursive template wrapping; branded-free literal proofs
export type Envelope<S extends string,C extends unknown[]=[]>=C['length'] extends 5?S:Envelope<`[${S}]`,[...C,unknown]>;
export function solve<const S extends string>(text:S): Envelope<S> {
  return ('['.repeat(5)+text+']'.repeat(5)) as Envelope<S>;
}
