// 457: Report policy 74: open, min 30, groups
// Filter records by amount >=30, status open; sort amount ascending, ties id ascending (code-unit). Skip 0, take 3. Return [team,totalAmount] pairs sorted by team, grouping only selected rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=457 [--starters]
// Study tests/457.cjs for examples.
export function solve(input: readonly {id:string;amount:number;status:'open'|'closed';team:string}[]): [string,number][] {
throw new Error('TODO exercise 457');
}
