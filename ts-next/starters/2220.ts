// 2220: Suffix-selected asset descriptors / asset-kinds=txt+json
// template suffix unions; discriminated metadata
export type File=`${string}.txt`|`${string}.json`;
export type Descriptor<S extends File>=S extends `${string}.txt`?{readonly kind:"text";readonly extension:"txt";readonly encoding:"utf8"}:S extends `${string}.json`?{readonly kind:"data";readonly extension:"json";readonly structured:true}:never;
export function solve<const S extends File>(filename:S): Descriptor<S> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2220');
}
