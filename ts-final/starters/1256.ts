// 1256: Exact tuple Promise resolution / scenario 08
// mapped tuples; Awaited; readonly removal
// Resolve a heterogeneous tuple concurrently using Promise.all semantics. Preserve each tuple position and recursively awaited type; return a mutable result tuple. Reject when any input rejects. Accept raw values and PromiseLike values.
// Scenario family repetition is intentional; see prompts/1256.txt and tests/1256.cjs.
export function solve<const T extends readonly unknown[]>(items:T): Promise<{ -readonly [K in keyof T]: Awaited<T[K]> }> {
  // Your implementation here.
  throw new Error('TODO exercise 1256');
}
