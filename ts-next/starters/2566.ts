// 2566: Abstract renderer specialization / abstract-render-fields=name+active+tags
// abstract classes; implements contracts; polymorphic calls
export type Model={ name: string; active: boolean; tags: readonly string[] };
export abstract class Renderer {abstract render(value:Model):string;renderAll(values:readonly Model[]):string[]{return values.map(value=>this.render(value));}}
export function solve(): Renderer {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2566');
}
