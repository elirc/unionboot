// 2557: Abstract renderer specialization / abstract-render-fields=active
// abstract classes; implements contracts; polymorphic calls
export type Model={ active: boolean };
export abstract class Renderer {abstract render(value:Model):string;renderAll(values:readonly Model[]):string[]{return values.map(value=>this.render(value));}}
export function solve(): Renderer {
  return new class extends Renderer {render(value:Model):string{return ["active"].map(key=>JSON.stringify(Reflect.get(value,key))).join(',');}};
}
