// 2259: Balanced literal envelope construction / bracket-depth=6
// recursive template wrapping; branded-free literal proofs
export type Envelope<S extends string,C extends unknown[]=[]>=C['length'] extends 6?S:Envelope<`[${S}]`,[...C,unknown]>;
export function solve<const S extends string>(text:S): Envelope<S> {
  return ('['.repeat(6)+text+']'.repeat(6)) as Envelope<S>;
}
