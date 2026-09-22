// 2268: Balanced literal envelope construction / bracket-depth=15
// recursive template wrapping; branded-free literal proofs
export type Envelope<S extends string,C extends unknown[]=[]>=C['length'] extends 15?S:Envelope<`[${S}]`,[...C,unknown]>;
export function solve<const S extends string>(text:S): Envelope<S> {
  return ('['.repeat(15)+text+']'.repeat(15)) as Envelope<S>;
}
