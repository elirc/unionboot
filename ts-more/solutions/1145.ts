// 1145: Two-stage typed composition / scenario 02
// higher-order generics; inference; callback variance
// Compose first then second into a unary function. Preserve initial input and final output types; reject incompatible intermediate types. Do not invoke either callback until the returned function is called. Propagate exceptions.
// Scenario family repetition is intentional; see prompts/1145.txt and tests/1145.cjs.
export function solve<A,B,C>(first:(input:A)=>B, second:(input:B)=>C): (input:A)=>C {
  return input=>second(first(input));
}
