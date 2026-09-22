// 1112: Runtime-frozen readonly snapshot / scenario 14
// Readonly mapped type; shallow copy semantics
// Return a fresh shallow-frozen object snapshot. The return type forbids top-level assignment; nested values retain their original types and references (not a deep freeze). Copy enumerable own properties including symbols; do not freeze or mutate the input.
// Scenario family repetition is intentional; see prompts/1112.txt and tests/1112.cjs.
export function solve<T extends object>(input:T): Readonly<T> {
  // Your implementation here.
  throw new Error('TODO exercise 1112');
}
