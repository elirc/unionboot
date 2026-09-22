// 2223: Suffix-selected asset descriptors / asset-kinds=png+mp3+txt+json
// template suffix unions; discriminated metadata
export type File=`${string}.png`|`${string}.mp3`|`${string}.txt`|`${string}.json`;
export type Descriptor<S extends File>=S extends `${string}.png`?{readonly kind:"image";readonly extension:"png";readonly channels:4}:S extends `${string}.mp3`?{readonly kind:"audio";readonly extension:"mp3";readonly sampleRate:44100}:S extends `${string}.txt`?{readonly kind:"text";readonly extension:"txt";readonly encoding:"utf8"}:S extends `${string}.json`?{readonly kind:"data";readonly extension:"json";readonly structured:true}:never;
export function solve<const S extends File>(filename:S): Descriptor<S> {
  const ext=filename.slice(filename.lastIndexOf('.')+1);switch(ext){case "png":return {"kind":"image","extension":"png","channels":4} as Descriptor<S>;case "mp3":return {"kind":"audio","extension":"mp3","sampleRate":44100} as Descriptor<S>;case "txt":return {"kind":"text","extension":"txt","encoding":"utf8"} as Descriptor<S>;case "json":return {"kind":"data","extension":"json","structured":true} as Descriptor<S>;default:throw new Error('Unsupported suffix');}
}
