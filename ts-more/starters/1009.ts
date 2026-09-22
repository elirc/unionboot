// 1009: Tagged shape measurement / scenario 01
// exhaustive discriminated unions; never
// Compute area from a circle, rectangle or triangle discriminated union. Dimensions are finite nonnegative numbers. Narrow by kind and exhaust every case with never, rather than reading properties shared by only some variants.
// Scenario family repetition is intentional; see prompts/1009.txt and tests/1009.cjs.
export type Shape = {kind:'circle'; radius:number} | {kind:'rectangle'; width:number; height:number} | {kind:'triangle'; base:number; height:number};
export function solve(shape: Shape): number {
  // Your implementation here.
  throw new Error('TODO exercise 1009');
}
