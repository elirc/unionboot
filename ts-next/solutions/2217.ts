// 2217: Suffix-selected asset descriptors / asset-kinds=png+json
// template suffix unions; discriminated metadata
export type File=`${string}.png`|`${string}.json`;
export type Descriptor<S extends File>=S extends `${string}.png`?{readonly kind:"image";readonly extension:"png";readonly channels:4}:S extends `${string}.json`?{readonly kind:"data";readonly extension:"json";readonly structured:true}:never;
export function solve<const S extends File>(filename:S): Descriptor<S> {
  const ext=filename.slice(filename.lastIndexOf('.')+1);switch(ext){case "png":return {"kind":"image","extension":"png","channels":4} as Descriptor<S>;case "json":return {"kind":"data","extension":"json","structured":true} as Descriptor<S>;default:throw new Error('Unsupported suffix');}
}
