// 499: Report policy 116: closed, min 0, rows
// Filter records by amount >=0, status closed; sort amount descending, ties id ascending (code-unit). Skip 1, take 3. Return {id,amount} rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=499 [--starters]
// Study tests/499.cjs for examples.
export function solve(input: readonly {id:string;amount:number;status:'open'|'closed';team:string}[]): {id:string;amount:number}[] {
const selected=input.filter(r=>r.amount>=0&&r.status==='closed').map(r=>({...r})).sort((a,b)=>b.amount-a.amount||(a.id<b.id?-1:a.id>b.id?1:0)).slice(1,4);return selected.map(r=>({id:r.id,amount:r.amount}));
}
