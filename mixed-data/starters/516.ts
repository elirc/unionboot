// 516: Report policy 133: open, min 20, total
// Filter records by amount >=20, status open; sort amount ascending, ties id ascending (code-unit). Skip 1, take 4. Return {count,total} for selected rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=516 [--starters]
// Study tests/516.cjs for examples.
export function solve(input: readonly {id:string;amount:number;status:'open'|'closed';team:string}[]): {count:number;total:number} {
throw new Error('TODO exercise 516');
}
