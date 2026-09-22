// 2218: Suffix-selected asset descriptors / asset-kinds=mp3+json
// template suffix unions; discriminated metadata
export type File=`${string}.mp3`|`${string}.json`;
export type Descriptor<S extends File>=S extends `${string}.mp3`?{readonly kind:"audio";readonly extension:"mp3";readonly sampleRate:44100}:S extends `${string}.json`?{readonly kind:"data";readonly extension:"json";readonly structured:true}:never;
export function solve<const S extends File>(filename:S): Descriptor<S> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2218');
}
