// 814: Shortest typed zip / scenario 01
// two type parameters; tuples; readonly
// Zip by index, stopping at the shorter input. Preserve independent element types and tuple position types. Return fresh mutable two-element tuples, without mutating either input.
// Scenario family repetition is intentional; see prompts/814.txt and tests/814.cjs.
export function solve<A, B>(left: readonly A[], right: readonly B[]): [A, B][] {
  const result: [A,B][] = []; for(let i=0;i<Math.min(left.length,right.length);i++) result.push([left[i]!,right[i]!]); return result;
}
