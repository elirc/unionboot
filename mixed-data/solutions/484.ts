// 484: Report policy 101: open, min 0, rows
// Filter records by amount >=0, status open; sort amount ascending, ties id ascending (code-unit). Skip 1, take 2. Return {id,amount} rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=484 [--starters]
// Study tests/484.cjs for examples.
export function solve(input: readonly {id:string;amount:number;status:'open'|'closed';team:string}[]): {id:string;amount:number}[] {
const selected=input.filter(r=>r.amount>=0&&r.status==='open').map(r=>({...r})).sort((a,b)=>a.amount-b.amount||(a.id<b.id?-1:a.id>b.id?1:0)).slice(1,3);return selected.map(r=>({id:r.id,amount:r.amount}));
}
