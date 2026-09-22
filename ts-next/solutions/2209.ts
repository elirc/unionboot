// 2209: Suffix-selected asset descriptors / asset-kinds=png
// template suffix unions; discriminated metadata
export type File=`${string}.png`;
export type Descriptor<S extends File>=S extends `${string}.png`?{readonly kind:"image";readonly extension:"png";readonly channels:4}:never;
export function solve<const S extends File>(filename:S): Descriptor<S> {
  const ext=filename.slice(filename.lastIndexOf('.')+1);switch(ext){case "png":return {"kind":"image","extension":"png","channels":4} as Descriptor<S>;default:throw new Error('Unsupported suffix');}
}
