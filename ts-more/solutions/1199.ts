// 1199: Generic frequency map / scenario 11
// generic Map keys; SameValueZero; readonly
// Count occurrences by SameValueZero equality, preserving first occurrence order of keys. Object keys use identity; NaN equals NaN. Return a fresh Map with the original key types and positive integer counts. Never mutate input.
// Scenario family repetition is intentional; see prompts/1199.txt and tests/1199.cjs.
export function solve<T>(items:readonly T[]): Map<T,number> {
  const out=new Map<T,number>();for(const item of items)out.set(item,(out.get(item)??0)+1);return out;
}
