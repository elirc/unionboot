// 1254: Exact tuple Promise resolution / scenario 06
// mapped tuples; Awaited; readonly removal
// Resolve a heterogeneous tuple concurrently using Promise.all semantics. Preserve each tuple position and recursively awaited type; return a mutable result tuple. Reject when any input rejects. Accept raw values and PromiseLike values.
// Scenario family repetition is intentional; see prompts/1254.txt and tests/1254.cjs.
export function solve<const T extends readonly unknown[]>(items:T): Promise<{ -readonly [K in keyof T]: Awaited<T[K]> }> {
  // Your implementation here.
  throw new Error('TODO exercise 1254');
}
