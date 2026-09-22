// 1327: Typed leaf path lookup / scenario 04
// nested keyof; indexed access; optional values
// Read a two-key path. First key belongs to T; second belongs to the non-nullable parent type. Missing/nullish parent returns undefined. Preserve leaf type and never coerce keys. Exactly two path positions; readonly tuples accepted.
// Scenario family repetition is intentional; see prompts/1327.txt and tests/1327.cjs.
export function solve<T, K1 extends keyof T, K2 extends keyof NonNullable<T[K1]>>(input:T, path:readonly [K1,K2]): NonNullable<T[K1]>[K2] | undefined {
  const parent=input[path[0]]; if(parent===null||parent===undefined)return undefined;return parent[path[1]];
}
