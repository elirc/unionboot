// 2558: Abstract renderer specialization / abstract-render-fields=name+active
// abstract classes; implements contracts; polymorphic calls
export type Model={ name: string; active: boolean };
export abstract class Renderer {abstract render(value:Model):string;renderAll(values:readonly Model[]):string[]{return values.map(value=>this.render(value));}}
export function solve(): Renderer {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2558');
}
