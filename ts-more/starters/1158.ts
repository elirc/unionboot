// 1158: Two-stage typed composition / scenario 15
// higher-order generics; inference; callback variance
// Compose first then second into a unary function. Preserve initial input and final output types; reject incompatible intermediate types. Do not invoke either callback until the returned function is called. Propagate exceptions.
// Scenario family repetition is intentional; see prompts/1158.txt and tests/1158.cjs.
export function solve<A,B,C>(first:(input:A)=>B, second:(input:B)=>C): (input:A)=>C {
  // Your implementation here.
  throw new Error('TODO exercise 1158');
}
