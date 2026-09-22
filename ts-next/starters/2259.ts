// 2259: Balanced literal envelope construction / bracket-depth=6
// recursive template wrapping; branded-free literal proofs
export type Envelope<S extends string,C extends unknown[]=[]>=C['length'] extends 6?S:Envelope<`[${S}]`,[...C,unknown]>;
export function solve<const S extends string>(text:S): Envelope<S> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2259');
}
