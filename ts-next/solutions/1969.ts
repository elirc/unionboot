// 1969: Bounded infer-chain box peeling / peel-budget=1
// conditional infer chains; recursion fuel; terminal values
export type Peel<T, Fuel extends unknown[] = [unknown]> = Fuel extends [unknown,...infer Rest] ? T extends {readonly value:infer V} ? Peel<V,Rest> : T : T;
export function solve<const T>(input: T): Peel<T> {
  let current: unknown=input; for(let i=0;i<1;i++){if(typeof current!=='object'||current===null||!Object.hasOwn(current,'value')) break; current=(current as {value:unknown}).value;} return current as Peel<T>;
}
