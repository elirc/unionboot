// 513: Report policy 130: any, min 40, total
// Filter records by amount >=40, status any; sort amount descending, ties id ascending (code-unit). Skip 1, take 4. Return {count,total} for selected rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=513 [--starters]
// Study tests/513.cjs for examples.
export function solve(input: readonly {id:string;amount:number;status:'open'|'closed';team:string}[]): {count:number;total:number} {
throw new Error('TODO exercise 513');
}
