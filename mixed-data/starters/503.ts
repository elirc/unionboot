// 503: Report policy 120: closed, min 40, rows
// Filter records by amount >=40, status closed; sort amount descending, ties id ascending (code-unit). Skip 1, take 3. Return {id,amount} rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=503 [--starters]
// Study tests/503.cjs for examples.
export function solve(input: readonly {id:string;amount:number;status:'open'|'closed';team:string}[]): {id:string;amount:number}[] {
throw new Error('TODO exercise 503');
}
