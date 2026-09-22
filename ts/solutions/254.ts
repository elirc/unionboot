// 254: Nullable count summary / basic
// Implement the stated API under strict TypeScript. Scenario policy literal '14-0' is required as the second argument and returned unchanged. Return {policy,result}. Nullable count summary; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=254 [--starters]
// Study tests/254.cjs for examples.
export function solve(input: readonly number[] | null, policy: '14-0'): {policy:'14-0'; result:{count:number;empty:boolean}} {
const compute =  (input: readonly number[] | null): {count:number;empty:boolean} => {return {count:input?.length??0,empty:!input?.length};};return {policy,result:compute(input)};
}
