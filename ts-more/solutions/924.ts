// 924: Typed Result mapping / scenario 06
// generic success/error unions; callback contracts
// Map only a successful Result payload. Preserve the error type and return the exact failure object without invoking the mapper. Propagate mapper exceptions. Success returns a fresh Result.
// Scenario family repetition is intentional; see prompts/924.txt and tests/924.cjs.
export type Result<T,E> = {ok:true; value:T} | {ok:false; error:E};
export function solve<T, E, U>(result: Result<T,E>, map: (value:T) => U): Result<U,E> {
  return result.ok ? {ok:true,value:map(result.value)} : result;
}
