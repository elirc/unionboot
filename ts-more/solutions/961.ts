// 961: Generic immutable tree map / scenario 13
// recursive types; readonly; generic transformation
// Recursively transform each node value while preserving child order and shape. Call mapper in preorder. Build fresh nodes/children arrays, never mutate input. Inputs are finite acyclic trees of moderate depth.
// Scenario family repetition is intentional; see prompts/961.txt and tests/961.cjs.
export type Tree<T> = {readonly value:T; readonly children: readonly Tree<T>[]};
export function solve<T, U>(tree: Tree<T>, map: (value:T) => U): Tree<U> {
  return {value:map(tree.value),children:tree.children.map(child=>solve(child,map))};
}
