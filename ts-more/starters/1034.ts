// 1034: Exhaustive counter reducer / scenario 11
// tagged actions; immutable state; readonly
// Apply add, multiply or reset. Every action appends the resulting value to history, including no-op arithmetic/reset. Return fresh state and history; leave previous state untouched. Inputs and arithmetic are finite.
// Scenario family repetition is intentional; see prompts/1034.txt and tests/1034.cjs.
export type State = {readonly value:number; readonly history:readonly number[]};
export type Action = {type:'add'; amount:number}|{type:'multiply';factor:number}|{type:'reset'};
export function solve(state: State, action: Action): State {
  // Your implementation here.
  throw new Error('TODO exercise 1034');
}
