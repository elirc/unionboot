// 1185: Flatten readonly generic layers / scenario 12
// nested readonly; generic element preservation
// Flatten exactly one array level, preserving element order, duplicates and references. Readonly inner and outer arrays are accepted. Deeper arrays remain values, not recursively flattened. Return a fresh mutable array.
// Scenario family repetition is intentional; see prompts/1185.txt and tests/1185.cjs.
export function solve<T>(groups: readonly (readonly T[])[]): T[] {
  const out:T[]=[];for(const group of groups) out.push(...group);return out;
}
