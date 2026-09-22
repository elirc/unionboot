// 2559: Abstract renderer specialization / abstract-render-fields=count+active
// abstract classes; implements contracts; polymorphic calls
export type Model={ count: number; active: boolean };
export abstract class Renderer {abstract render(value:Model):string;renderAll(values:readonly Model[]):string[]{return values.map(value=>this.render(value));}}
export function solve(): Renderer {
  return new class extends Renderer {render(value:Model):string{return ["count","active"].map(key=>JSON.stringify(Reflect.get(value,key))).join(',');}};
}
