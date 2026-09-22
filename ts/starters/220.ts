// 220: Generic identity copy / empty-boundary
// Implement the stated API under strict TypeScript. Scenario policy literal '7-1' is required as the second argument and returned unchanged. Return {policy,result}. Generic identity copy; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=220 [--starters]
// Study tests/220.cjs for examples.
export function solve<T>(input: readonly T[], policy: '7-1'): {policy:'7-1'; result:T[]} {
throw new Error('TODO exercise 220');
}
