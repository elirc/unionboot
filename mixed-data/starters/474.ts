// 474: Report policy 91: any, min 0, rows
// Filter records by amount >=0, status any; sort amount ascending, ties id ascending (code-unit). Skip 1, take 2. Return {id,amount} rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=474 [--starters]
// Study tests/474.cjs for examples.
export function solve(input: readonly {id:string;amount:number;status:'open'|'closed';team:string}[]): {id:string;amount:number}[] {
throw new Error('TODO exercise 474');
}
