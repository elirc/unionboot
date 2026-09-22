// 1032: Exhaustive counter reducer / scenario 09
// tagged actions; immutable state; readonly
// Apply add, multiply or reset. Every action appends the resulting value to history, including no-op arithmetic/reset. Return fresh state and history; leave previous state untouched. Inputs and arithmetic are finite.
// Scenario family repetition is intentional; see prompts/1032.txt and tests/1032.cjs.
export type State = {readonly value:number; readonly history:readonly number[]};
export type Action = {type:'add'; amount:number}|{type:'multiply';factor:number}|{type:'reset'};
export function solve(state: State, action: Action): State {
  let value:number; switch(action.type){case 'add':value=state.value+action.amount;break;case 'multiply':value=state.value*action.factor;break;case 'reset':value=0;break;default:{const exhaustive:never=action;return exhaustive;}} return {value,history:[...state.history,value]};
}
