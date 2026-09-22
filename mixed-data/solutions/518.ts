// 518: Report policy 135: open, min 40, total
// Filter records by amount >=40, status open; sort amount ascending, ties id ascending (code-unit). Skip 1, take 4. Return {count,total} for selected rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=518 [--starters]
// Study tests/518.cjs for examples.
export function solve(input: readonly {id:string;amount:number;status:'open'|'closed';team:string}[]): {count:number;total:number} {
const selected=input.filter(r=>r.amount>=40&&r.status==='open').map(r=>({...r})).sort((a,b)=>a.amount-b.amount||(a.id<b.id?-1:a.id>b.id?1:0)).slice(1,5);return {count:selected.length,total:selected.reduce((s,r)=>s+r.amount,0)};
}
