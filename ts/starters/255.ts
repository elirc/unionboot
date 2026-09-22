// 255: Nullable count summary / empty-boundary
// Implement the stated API under strict TypeScript. Scenario policy literal '14-1' is required as the second argument and returned unchanged. Return {policy,result}. Nullable count summary; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=255 [--starters]
// Study tests/255.cjs for examples.
export function solve(input: readonly number[] | null, policy: '14-1'): {policy:'14-1'; result:{count:number;empty:boolean}} {
throw new Error('TODO exercise 255');
}
