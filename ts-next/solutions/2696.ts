// 2696: Index-safe fixed vector dot products / vector-dimension=8
// fixed tuple dimensions; corresponding input arity
export type Vector=readonly [number, number, number, number, number, number, number, number];
export function solve(left:Vector,right:Vector): number {
  let total=0;for(let i=0;i<8;i++)total+=left[i]!*right[i]!;return total;
}
