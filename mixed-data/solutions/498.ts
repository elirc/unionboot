// 498: Report policy 115: closed, min 40, rows
// Filter records by amount >=40, status closed; sort amount ascending, ties id ascending (code-unit). Skip 1, take 3. Return {id,amount} rows. Never mutate input. Records are valid, amounts finite, IDs unique.
// Tests: node mixed-data/verify.cjs --id=498 [--starters]
// Study tests/498.cjs for examples.
export function solve(input: readonly {id:string;amount:number;status:'open'|'closed';team:string}[]): {id:string;amount:number}[] {
const selected=input.filter(r=>r.amount>=40&&r.status==='closed').map(r=>({...r})).sort((a,b)=>a.amount-b.amount||(a.id<b.id?-1:a.id>b.id?1:0)).slice(1,4);return selected.map(r=>({id:r.id,amount:r.amount}));
}
