// 2150: Budgeted delimited literal parsing / maximum-splits=2
// template-literal split inference; trailing empty positions
export type Split<S extends string,A extends string[]=[]>=A['length'] extends 2?readonly [...A,S]:S extends `${infer H}|${infer R}`?Split<R,[...A,H]>:readonly [...A,S];
export function solve<const S extends string>(text:S): Split<S> {
  const out:string[]=[];let rest:string=text;for(let i=0;i<2;i++){const at=rest.indexOf('|');if(at<0)break;out.push(rest.slice(0,at));rest=rest.slice(at+1);}out.push(rest);/* Each iteration consumes the first delimiter; append the untouched remainder after the same budget as Split<S>. */ return out as unknown as Split<S>;
}
