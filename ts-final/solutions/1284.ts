// 1284: Discriminant-selected union extraction / scenario 06
// Extract; indexed access; generic unions
// Select records with a matching kind. Given a discriminated union, the returned array contains only the selected union member type via Extract. Preserve order and object identity. K must be a member of the input kind union.
// Scenario family repetition is intentional; see prompts/1284.txt and tests/1284.cjs.
export function solve<T extends {kind:string}, K extends T['kind']>(items:readonly T[], kind:K): Extract<T,{kind:K}>[] {
  return items.filter((item):item is Extract<T,{kind:K}>=>item.kind===kind);
}
