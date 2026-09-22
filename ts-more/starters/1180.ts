// 1180: Flatten readonly generic layers / scenario 07
// nested readonly; generic element preservation
// Flatten exactly one array level, preserving element order, duplicates and references. Readonly inner and outer arrays are accepted. Deeper arrays remain values, not recursively flattened. Return a fresh mutable array.
// Scenario family repetition is intentional; see prompts/1180.txt and tests/1180.cjs.
export function solve<T>(groups: readonly (readonly T[])[]): T[] {
  // Your implementation here.
  throw new Error('TODO exercise 1180');
}
