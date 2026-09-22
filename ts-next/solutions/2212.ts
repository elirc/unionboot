// 2212: Suffix-selected asset descriptors / asset-kinds=txt
// template suffix unions; discriminated metadata
export type File=`${string}.txt`;
export type Descriptor<S extends File>=S extends `${string}.txt`?{readonly kind:"text";readonly extension:"txt";readonly encoding:"utf8"}:never;
export function solve<const S extends File>(filename:S): Descriptor<S> {
  const ext=filename.slice(filename.lastIndexOf('.')+1);switch(ext){case "txt":return {"kind":"text","extension":"txt","encoding":"utf8"} as Descriptor<S>;default:throw new Error('Unsupported suffix');}
}
