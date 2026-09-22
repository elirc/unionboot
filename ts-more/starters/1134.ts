// 1134: Literal pair constructor / scenario 06
// const type parameters; readonly tuples; inference
// Construct a readonly pair preserving literal inference for both independent arguments. Return their exact references in order, not copies. Readonly is a compile-time tuple contract; no runtime freeze is required.
// Scenario family repetition is intentional; see prompts/1134.txt and tests/1134.cjs.
export function solve<const A, const B>(first:A, second:B): readonly [A,B] {
  // Your implementation here.
  throw new Error('TODO exercise 1134');
}
