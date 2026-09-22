// 2568: Abstract renderer specialization / abstract-render-fields=name+count+active+tags
// abstract classes; implements contracts; polymorphic calls
export type Model={ name: string; count: number; active: boolean; tags: readonly string[] };
export abstract class Renderer {abstract render(value:Model):string;renderAll(values:readonly Model[]):string[]{return values.map(value=>this.render(value));}}
export function solve(): Renderer {
  return new class extends Renderer {render(value:Model):string{return ["name","count","active","tags"].map(key=>JSON.stringify(Reflect.get(value,key))).join(',');}};
}
