// 949: Generic immutable tree map / scenario 01
// recursive types; readonly; generic transformation
// Recursively transform each node value while preserving child order and shape. Call mapper in preorder. Build fresh nodes/children arrays, never mutate input. Inputs are finite acyclic trees of moderate depth.
// Scenario family repetition is intentional; see prompts/949.txt and tests/949.cjs.
export type Tree<T> = {readonly value:T; readonly children: readonly Tree<T>[]};
export function solve<T, U>(tree: Tree<T>, map: (value:T) => U): Tree<U> {
  // Your implementation here.
  throw new Error('TODO exercise 949');
}
