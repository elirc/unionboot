// 505: Report policy 122: any, min 10, total
// Filter records by amount >=10, status any; sort amount ascending, ties id ascending (code-unit). Skip 1, take 4. Return {count,total} for selected rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=505 [--starters]
// Study tests/505.cjs for examples.
export function solve(input: readonly {id:string;amount:number;status:'open'|'closed';team:string}[]): {count:number;total:number} {
const selected=input.filter(r=>r.amount>=10).map(r=>({...r})).sort((a,b)=>a.amount-b.amount||(a.id<b.id?-1:a.id>b.id?1:0)).slice(1,5);return {count:selected.length,total:selected.reduce((s,r)=>s+r.amount,0)};
}
