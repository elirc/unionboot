// 2213: Suffix-selected asset descriptors / asset-kinds=png+txt
// template suffix unions; discriminated metadata
export type File=`${string}.png`|`${string}.txt`;
export type Descriptor<S extends File>=S extends `${string}.png`?{readonly kind:"image";readonly extension:"png";readonly channels:4}:S extends `${string}.txt`?{readonly kind:"text";readonly extension:"txt";readonly encoding:"utf8"}:never;
export function solve<const S extends File>(filename:S): Descriptor<S> {
  const ext=filename.slice(filename.lastIndexOf('.')+1);switch(ext){case "png":return {"kind":"image","extension":"png","channels":4} as Descriptor<S>;case "txt":return {"kind":"text","extension":"txt","encoding":"utf8"} as Descriptor<S>;default:throw new Error('Unsupported suffix');}
}
