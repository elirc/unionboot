// 231: Generic last value / duplicate-values
// Implement the stated API under strict TypeScript. Scenario policy literal '9-2' is required as the second argument and returned unchanged. Return {policy,result}. Generic last value; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=231 [--starters]
// Study tests/231.cjs for examples.
export function solve<T>(input: readonly T[], policy: '9-2'): {policy:'9-2'; result:T | undefined} {
throw new Error('TODO exercise 231');
}
