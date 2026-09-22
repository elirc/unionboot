// 1209: Variadic call forwarding / scenario 06
// variadic tuple inference; Parameters; ReturnType
// Call a function once with its typed positional arguments, preserving tuple arity, optional parameters and return type. Return its exact result/reference; propagate exceptions. No implicit this binding is supplied.
// Scenario family repetition is intentional; see prompts/1209.txt and tests/1209.cjs.
export function solve<Args extends unknown[], R>(fn:(...args:Args)=>R, ...args:Args): R {
  return fn(...args);
}
