// 492: Report policy 109: open, min 30, rows
// Filter records by amount >=30, status open; sort amount descending, ties id ascending (code-unit). Skip 1, take 3. Return {id,amount} rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=492 [--starters]
// Study tests/492.cjs for examples.
export function solve(input: readonly {id:string;amount:number;status:'open'|'closed';team:string}[]): {id:string;amount:number}[] {
const selected=input.filter(r=>r.amount>=30&&r.status==='open').map(r=>({...r})).sort((a,b)=>b.amount-a.amount||(a.id<b.id?-1:a.id>b.id?1:0)).slice(1,4);return selected.map(r=>({id:r.id,amount:r.amount}));
}
