// 2214: Suffix-selected asset descriptors / asset-kinds=mp3+txt
// template suffix unions; discriminated metadata
export type File=`${string}.mp3`|`${string}.txt`;
export type Descriptor<S extends File>=S extends `${string}.mp3`?{readonly kind:"audio";readonly extension:"mp3";readonly sampleRate:44100}:S extends `${string}.txt`?{readonly kind:"text";readonly extension:"txt";readonly encoding:"utf8"}:never;
export function solve<const S extends File>(filename:S): Descriptor<S> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2214');
}
