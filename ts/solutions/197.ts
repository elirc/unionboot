// 197: Discriminated sign union / negative-values
// Implement the stated API under strict TypeScript. Scenario policy literal '2-3' is required as the second argument and returned unchanged. Return {policy,result}. Discriminated sign union; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.
// Tests: node ts/verify.cjs --id=197 [--starters]
// Study tests/197.cjs for examples.
export function solve(input: readonly number[], policy: '2-3'): {policy:'2-3'; result:({kind:'negative';value:number}|{kind:'nonnegative';value:number})[]} {
const compute =  (input: readonly number[]): ({kind:'negative';value:number}|{kind:'nonnegative';value:number})[] => {return input.map(value=>value<0?{kind:'negative' as const,value}:{kind:'nonnegative' as const,value});};return {policy,result:compute(input)};
}
