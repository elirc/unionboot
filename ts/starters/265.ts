// 265: Discriminated parity labels / empty-boundary
// Implement the stated API under strict TypeScript. Scenario policy literal '16-1' is required as the second argument and returned unchanged. Return {policy,result}. Discriminated parity labels; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=265 [--starters]
// Study tests/265.cjs for examples.
export function solve(input: readonly number[], policy: '16-1'): {policy:'16-1'; result:{value:number;parity:'even'|'odd'}[]} {
throw new Error('TODO exercise 265');
}
