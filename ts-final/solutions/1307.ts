// 1307: Result-producing flatMap / scenario 14
// generic union composition; error unions
// Chain a Result-returning function without nesting Results. Successful input invokes next once; failure returns the same input object without invoking next. Output combines the original and next error types. Propagate callback exceptions.
// Scenario family repetition is intentional; see prompts/1307.txt and tests/1307.cjs.
export type Result<T,E>={ok:true;value:T}|{ok:false;error:E};
export function solve<T,E,U,F>(input:Result<T,E>, next:(value:T)=>Result<U,F>): Result<U,E|F> {
  return input.ok ? next(input.value) : input;
}
