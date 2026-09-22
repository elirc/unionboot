// 2216: Suffix-selected asset descriptors / asset-kinds=json
// template suffix unions; discriminated metadata
export type File=`${string}.json`;
export type Descriptor<S extends File>=S extends `${string}.json`?{readonly kind:"data";readonly extension:"json";readonly structured:true}:never;
export function solve<const S extends File>(filename:S): Descriptor<S> {
  const ext=filename.slice(filename.lastIndexOf('.')+1);switch(ext){case "json":return {"kind":"data","extension":"json","structured":true} as Descriptor<S>;default:throw new Error('Unsupported suffix');}
}
