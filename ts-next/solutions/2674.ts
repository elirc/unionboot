// 2674: I18n named message argument inference / message-arguments=1
// template placeholder inference; repeated named arguments
export type Message="Hello {name1}! {name1}";
export type Names<S extends string>=S extends `${string}{${infer K}}${infer Rest}`?K|Names<Rest>:never;
export type Args={[K in Names<Message>]:string};
export function solve(args:Args): string {
  return "Hello {name1}! {name1}".replace(/[{]([^}]+)[}]/g,(_,key:string)=>args[key as keyof Args]);
}
