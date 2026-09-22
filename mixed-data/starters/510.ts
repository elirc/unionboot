// 510: Report policy 127: any, min 10, total
// Filter records by amount >=10, status any; sort amount descending, ties id ascending (code-unit). Skip 1, take 4. Return {count,total} for selected rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=510 [--starters]
// Study tests/510.cjs for examples.
export function solve(input: readonly {id:string;amount:number;status:'open'|'closed';team:string}[]): {count:number;total:number} {
throw new Error('TODO exercise 510');
}
