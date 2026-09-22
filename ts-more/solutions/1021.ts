// 1021: Tagged shape measurement / scenario 13
// exhaustive discriminated unions; never
// Compute area from a circle, rectangle or triangle discriminated union. Dimensions are finite nonnegative numbers. Narrow by kind and exhaust every case with never, rather than reading properties shared by only some variants.
// Scenario family repetition is intentional; see prompts/1021.txt and tests/1021.cjs.
export type Shape = {kind:'circle'; radius:number} | {kind:'rectangle'; width:number; height:number} | {kind:'triangle'; base:number; height:number};
export function solve(shape: Shape): number {
  switch(shape.kind){case 'circle': return Math.PI*shape.radius**2; case 'rectangle': return shape.width*shape.height; case 'triangle':return shape.base*shape.height/2; default:{const exhaustive:never=shape;return exhaustive;}}
}
