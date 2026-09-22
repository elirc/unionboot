// 2213: Suffix-selected asset descriptors / asset-kinds=png+txt
// template suffix unions; discriminated metadata
export type File=`${string}.png`|`${string}.txt`;
export type Descriptor<S extends File>=S extends `${string}.png`?{readonly kind:"image";readonly extension:"png";readonly channels:4}:S extends `${string}.txt`?{readonly kind:"text";readonly extension:"txt";readonly encoding:"utf8"}:never;
export function solve<const S extends File>(filename:S): Descriptor<S> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2213');
}
