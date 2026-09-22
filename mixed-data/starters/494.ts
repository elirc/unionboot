// 494: Report policy 111: closed, min 0, rows
// Filter records by amount >=0, status closed; sort amount ascending, ties id ascending (code-unit). Skip 1, take 3. Return {id,amount} rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=494 [--starters]
// Study tests/494.cjs for examples.
export function solve(input: readonly {id:string;amount:number;status:'open'|'closed';team:string}[]): {id:string;amount:number}[] {
throw new Error('TODO exercise 494');
}
