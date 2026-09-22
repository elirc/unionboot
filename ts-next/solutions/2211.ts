// 2211: Suffix-selected asset descriptors / asset-kinds=png+mp3
// template suffix unions; discriminated metadata
export type File=`${string}.png`|`${string}.mp3`;
export type Descriptor<S extends File>=S extends `${string}.png`?{readonly kind:"image";readonly extension:"png";readonly channels:4}:S extends `${string}.mp3`?{readonly kind:"audio";readonly extension:"mp3";readonly sampleRate:44100}:never;
export function solve<const S extends File>(filename:S): Descriptor<S> {
  const ext=filename.slice(filename.lastIndexOf('.')+1);switch(ext){case "png":return {"kind":"image","extension":"png","channels":4} as Descriptor<S>;case "mp3":return {"kind":"audio","extension":"mp3","sampleRate":44100} as Descriptor<S>;default:throw new Error('Unsupported suffix');}
}
