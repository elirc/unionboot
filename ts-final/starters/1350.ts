// 1350: Template-literal field events / scenario 12
// template literal types; mapped keys; keyof
// Create a field change envelope with event `${key}Changed` and the corresponding field value. Preserve the specific event literal and payload type in the return. Reject unknown fields and mismatched payloads instead of widening the key.
// Scenario family repetition is intentional; see prompts/1350.txt and tests/1350.cjs.
export type Field={name:string;age:number;enabled:boolean};
export type Change<K extends keyof Field>={event:`${K}Changed`;value:Field[K]};
export function solve<K extends keyof Field>(key:K, value:NoInfer<Field[K]>): Change<K> {
  // Your implementation here.
  throw new Error('TODO exercise 1350');
}
