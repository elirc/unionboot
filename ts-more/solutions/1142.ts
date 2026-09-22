// 1142: Literal pair constructor / scenario 14
// const type parameters; readonly tuples; inference
// Construct a readonly pair preserving literal inference for both independent arguments. Return their exact references in order, not copies. Readonly is a compile-time tuple contract; no runtime freeze is required.
// Scenario family repetition is intentional; see prompts/1142.txt and tests/1142.cjs.
export function solve<const A, const B>(first:A, second:B): readonly [A,B] {
  return [first,second] as const;
}
