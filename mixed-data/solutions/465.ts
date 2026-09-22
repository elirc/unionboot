// 465: Report policy 82: closed, min 10, groups
// Filter records by amount >=10, status closed; sort amount ascending, ties id ascending (code-unit). Skip 0, take 4. Return [team,totalAmount] pairs sorted by team, grouping only selected rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=465 [--starters]
// Study tests/465.cjs for examples.
export function solve(input: readonly {id:string;amount:number;status:'open'|'closed';team:string}[]): [string,number][] {
const selected=input.filter(r=>r.amount>=10&&r.status==='closed').map(r=>({...r})).sort((a,b)=>a.amount-b.amount||(a.id<b.id?-1:a.id>b.id?1:0)).slice(0,4);const groups:Record<string,number>={};for(const r of selected)groups[r.team]=(groups[r.team]??0)+r.amount;return Object.entries(groups).sort(([a],[b])=>a<b?-1:a>b?1:0);
}
