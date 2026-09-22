// 198: Discriminated sign union / large-values
// Implement the stated API under strict TypeScript. Scenario policy literal '2-4' is required as the second argument and returned unchanged. Return {policy,result}. Discriminated sign union; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=198 [--starters]
// Study tests/198.cjs for examples.
export function solve(input: readonly number[], policy: '2-4'): {policy:'2-4'; result:({kind:'negative';value:number}|{kind:'nonnegative';value:number})[]} {
throw new Error('TODO exercise 198');
}
