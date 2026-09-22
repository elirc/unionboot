// 2211: Suffix-selected asset descriptors / asset-kinds=png+mp3
// template suffix unions; discriminated metadata
export type File=`${string}.png`|`${string}.mp3`;
export type Descriptor<S extends File>=S extends `${string}.png`?{readonly kind:"image";readonly extension:"png";readonly channels:4}:S extends `${string}.mp3`?{readonly kind:"audio";readonly extension:"mp3";readonly sampleRate:44100}:never;
export function solve<const S extends File>(filename:S): Descriptor<S> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2211');
}
