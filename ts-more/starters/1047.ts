// 1047: Own-property typed pick / scenario 09
// Pick; keyof; symbol keys; mapped results
// Copy the requested own keys into a fresh object, preserving key-specific value types and optional/readonly modifiers statically. Duplicate requested keys are harmless. Missing own keys throw Error("Missing own key") even if inherited. Support symbols and __proto__ safely. A localized assertion while constructing Pick is acceptable.
// Scenario family repetition is intentional; see prompts/1047.txt and tests/1047.cjs.
export function solve<T extends object, K extends keyof T>(input: T, keys: readonly K[]): Pick<T,K> {
  // Your implementation here.
  throw new Error('TODO exercise 1047');
}
