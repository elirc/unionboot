// 1093: Exact optional settings patch / scenario 10
// Partial; exactOptionalPropertyTypes; immutable merge
// Apply an optional subset of settings name/retries/enabled to a fresh object. Absent patch keys retain old values; false, zero and empty string are real replacements. Explicit undefined is forbidden by exactOptionalPropertyTypes. Leave both arguments unchanged.
// Scenario family repetition is intentional; see prompts/1093.txt and tests/1093.cjs.
export type Settings = {readonly name:string; readonly retries:number; readonly enabled:boolean};
export type Patch = Partial<Settings>;
export function solve(settings:Settings, patch:Patch): Settings {
  // Your implementation here.
  throw new Error('TODO exercise 1093');
}
