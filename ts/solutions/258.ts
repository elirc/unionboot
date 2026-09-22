// 258: Nullable count summary / large-values
// Implement the stated API under strict TypeScript. Scenario policy literal '14-4' is required as the second argument and returned unchanged. Return {policy,result}. Nullable count summary; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=258 [--starters]
// Study tests/258.cjs for examples.
export function solve(input: readonly number[] | null, policy: '14-4'): {policy:'14-4'; result:{count:number;empty:boolean}} {
const compute =  (input: readonly number[] | null): {count:number;empty:boolean} => {return {count:input?.length??0,empty:!input?.length};};return {policy,result:compute(input)};
}
