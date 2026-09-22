// 1285: Discriminant-selected union extraction / scenario 07
// Extract; indexed access; generic unions
// Select records with a matching kind. Given a discriminated union, the returned array contains only the selected union member type via Extract. Preserve order and object identity. K must be a member of the input kind union.
// Scenario family repetition is intentional; see prompts/1285.txt and tests/1285.cjs.
export function solve<T extends {kind:string}, K extends T['kind']>(items:readonly T[], kind:K): Extract<T,{kind:K}>[] {
  // Your implementation here.
  throw new Error('TODO exercise 1285');
}
