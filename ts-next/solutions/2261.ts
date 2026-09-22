// 2261: Balanced literal envelope construction / bracket-depth=8
// recursive template wrapping; branded-free literal proofs
export type Envelope<S extends string,C extends unknown[]=[]>=C['length'] extends 8?S:Envelope<`[${S}]`,[...C,unknown]>;
export function solve<const S extends string>(text:S): Envelope<S> {
  return ('['.repeat(8)+text+']'.repeat(8)) as Envelope<S>;
}
