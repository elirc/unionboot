// 511: Report policy 128: any, min 20, total
// Filter records by amount >=20, status any; sort amount descending, ties id ascending (code-unit). Skip 1, take 4. Return {count,total} for selected rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=511 [--starters]
// Study tests/511.cjs for examples.
export function solve(input: readonly {id:string;amount:number;status:'open'|'closed';team:string}[]): {count:number;total:number} {
const selected=input.filter(r=>r.amount>=20).map(r=>({...r})).sort((a,b)=>b.amount-a.amount||(a.id<b.id?-1:a.id>b.id?1:0)).slice(1,5);return {count:selected.length,total:selected.reduce((s,r)=>s+r.amount,0)};
}
