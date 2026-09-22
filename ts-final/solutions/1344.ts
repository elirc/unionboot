// 1344: Template-literal field events / scenario 06
// template literal types; mapped keys; keyof
// Create a field change envelope with event `${key}Changed` and the corresponding field value. Preserve the specific event literal and payload type in the return. Reject unknown fields and mismatched payloads instead of widening the key.
// Scenario family repetition is intentional; see prompts/1344.txt and tests/1344.cjs.
export type Field={name:string;age:number;enabled:boolean};
export type Change<K extends keyof Field>={event:`${K}Changed`;value:Field[K]};
export function solve<K extends keyof Field>(key:K, value:NoInfer<Field[K]>): Change<K> {
  return {event:`${key}Changed`,value};
}
