// 1069: Typed object value mapping / scenario 01
// mapped types; own string keys; generic callbacks
// Transform each own enumerable string-keyed value with a callback. Preserve string key names in the result type, drop symbol keys; numeric-only key declarations are outside the domain. Map in Object.keys order. Handle __proto__ as an ordinary own property. Localized assertions to bridge Object.keys are permitted.
// Scenario family repetition is intentional; see prompts/1069.txt and tests/1069.cjs.
export type StringMap<T,R> = {[K in keyof T as K extends string ? K : never]:R};
export function solve<T extends object, R>(input:T, map:(value:T[Extract<keyof T,string>], key:Extract<keyof T,string>)=>R): StringMap<T,R> {
  // Your implementation here.
  throw new Error('TODO exercise 1069');
}
