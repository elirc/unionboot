// 1045: Own-property typed pick / scenario 07
// Pick; keyof; symbol keys; mapped results
// Copy the requested own keys into a fresh object, preserving key-specific value types and optional/readonly modifiers statically. Duplicate requested keys are harmless. Missing own keys throw Error("Missing own key") even if inherited. Support symbols and __proto__ safely. A localized assertion while constructing Pick is acceptable.
// Scenario family repetition is intentional; see prompts/1045.txt and tests/1045.cjs.
export function solve<T extends object, K extends keyof T>(input: T, keys: readonly K[]): Pick<T,K> {
  const out = {} as Pick<T,K>; for(const key of keys){if(!Object.hasOwn(input,key)) throw new Error('Missing own key'); Object.defineProperty(out,key,{value:input[key],enumerable:true,writable:true,configurable:true});} return out;
}
